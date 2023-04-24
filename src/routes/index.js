import express from 'express';
const routes = express.Router()
import OwnerRoutes from './Owner/owner.route';
import StoreRoutes from './Store/store.routes';
import BrandRoute from './brand/brand.routes';
import CategoryRoutes from './category/category';
import ProductRoutes from './products/product.route';
import adminRoutes from './admin/admin.routes';
const PATH ={
    USERS:'/owner',
    Stores:"/stores",
    Brand:"/brand",
    Category:"/Category",
    Product:'/product',
    Admin:'/admin'
    
}
routes.use(PATH.USERS,OwnerRoutes)
routes.use(PATH.Stores,StoreRoutes)
routes.use(PATH.Brand,BrandRoute)
routes.use(PATH.Category,CategoryRoutes)
routes.use(PATH.Product,ProductRoutes)
routes.use(PATH.Admin, adminRoutes)
export default routes