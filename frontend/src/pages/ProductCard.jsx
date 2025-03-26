import {
  Box,
  IconButton,
  Image,
  useColorModeValue,
  Heading,
  Text,
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Input,
  Button
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useProductStore } from '../store/product';
import React ,{useState} from 'react';

const ProductCard = ({ product }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [isDeleting, setIsDeleting] = useState(false);

  const textColor = useColorModeValue('gray.600', 'gray.200');
  const bg = useColorModeValue('white', 'gray.800');

  const { deleteProduct ,updateProduct} = useProductStore();
  const toast = useToast();
  const {isOpen, onOpen ,onClose} = useDisclosure();

  const handleDeleteProduct = async (pid) => {
    if (!deleteProduct) {
      toast({
        title: 'Error',
        description: 'Delete function is not available.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    setIsDeleting(true);
    const { success, message } = await deleteProduct(pid);
    setIsDeleting(false);
  
    toast({
      title: success ? 'Success' : 'Error',
      description: message,
      status: success ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
  };
  

  
  const handleUpdateProduct = async (pid, updatedProduct) => {
    const { success, message } = await updateProduct(pid, updatedProduct);
    onClose(); // Close the modal after updating
    
    if (!success) {
      toast({
        title: 'Error',
        description: 'Update function is not available.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Success',
        description: 'Updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
      bg={bg}
    >
      <Image
        src={product.image}
        alt={product.name}
        h={48}
        w="full"
        objectFit="cover"
      />
      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {product.name}
        </Heading>
        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
          ${product.price}
        </Text>
        <HStack spacing={2}>
          <IconButton
            icon={<EditIcon />}
            colorScheme="blue"
            aria-label={`Edit product: ${product.name}`}
            onClick={onOpen}
          />
          <IconButton
            icon={<DeleteIcon />}
            onClick={() => handleDeleteProduct(product._id)}
            colorScheme="red"
            aria-label={`Delete product: ${product.name}`}
            isLoading={isDeleting}
          />
        </HStack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <VStack spacing={4}>
              <Input 
              placeholder='Name' 
              name='name'
              value={updatedProduct.name} 
              onChange={(e)=>setUpdatedProduct({...updatedProduct,name:e.target.value})}
              />


              <Input 
              placeholder='Price' 
              name='price' 
              value={updatedProduct.price} 
              onChange={(e)=>setUpdatedProduct({...updatedProduct,price:e.target.value})}
              />

              <Input 
              placeholder='Image URL' 
              name='image' 
              value={updatedProduct.image}
              onChange={(e)=>setUpdatedProduct({...updatedProduct,image:e.target.value})}
              />
              
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorscheme='blue' mr={3}
              onClick={()=> handleUpdateProduct(product._id,updatedProduct)}
            >
              Update
            </Button>
            <Button variant='ghost' onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent> 
      </Modal>
    </Box>
  );
};

export default ProductCard
