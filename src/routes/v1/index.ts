import express from 'express';
import apikey from '../../auth/apikey';
import signup from './access/signup';
import login from './access/login';
import logout from './access/logout';
// import token from './access/token';
// import blogList from './blog/blogList';
// import blogDetail from './blog/blogDetail';
import products from './products/products';
import categories from './categories/categories';
import orders from './orders/orders';
// import editor from './blog/editor';
import user from './profile/user';
import customers from './customers/Customers';

const router = express.Router(); 

// /*-------------------------------------------------------------------------*/
// // Below all APIs are public APIs protected by api-key
router.use('/', apikey);
// /*-------------------------------------------------------------------------*/

router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);
router.use('/products', products);
router.use('/profile', user);
router.use('/categories', categories);
router.use('/orders', orders);
router.use('/customer', customers);
// router.use('/token', token);
// // router.use('/blogs', blogList);
// // router.use('/blog', blogDetail);
// // router.use('/editor/blog', editor);

export default router;
