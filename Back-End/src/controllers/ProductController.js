import BaseController from "./BaseController.js";
import Product from "../models/Product.js";
// create class product with CRUD

export default class ProductController extends BaseController {
  constructor() {
    super(Product);
  }
}
