import BaseController from "./BaseController.js";
import Image from "../models/Image.js";
// create class Image with CRUD

export default class ImageController extends BaseController {
  constructor() {
    super(Image);
  }
}
