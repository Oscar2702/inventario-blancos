
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  minimumStock: number;
  description?: string;
  createdAt: string;
}

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private nextId = 1;

  findAll(): Product[] {
    return [...this.products];
  }

  findOne(id: number): Product {
    const product = this.products.find((item) => item.id === id);

    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }

    return product;
  }

  create(dto: CreateProductDto): Product {
    const name = dto.name?.trim();
    const category = dto.category?.trim();

    if (!name || !category) {
      throw new BadRequestException(
        'El nombre y la categoría son obligatorios',
      );
    }

    this.validateNumbers(dto.price, dto.quantity, dto.minimumStock);

    const product: Product = {
      id: this.nextId++,
      name,
      category,
      price: dto.price,
      quantity: dto.quantity,
      minimumStock: dto.minimumStock,
      description: dto.description?.trim(),
      createdAt: new Date().toISOString(),
    };

    this.products.push(product);
    return product;
  }

  update(id: number, dto: UpdateProductDto): Product {
    const product = this.findOne(id);

    if (dto.name !== undefined) {
      if (typeof dto.name !== 'string' || !dto.name.trim()) {
        throw new BadRequestException('El nombre no puede estar vacío');
      }
      product.name = dto.name.trim();
    }

    if (dto.category !== undefined) {
      if (typeof dto.category !== 'string' || !dto.category.trim()) {
        throw new BadRequestException('La categoría no puede estar vacía');
      }
      product.category = dto.category.trim();
    }

    if (dto.price !== undefined) {
      this.validateNumbers(dto.price);
      product.price = dto.price;
    }

    if (dto.quantity !== undefined) {
      this.validateNumbers(undefined, dto.quantity);
      product.quantity = dto.quantity;
    }

    if (dto.minimumStock !== undefined) {
      this.validateNumbers(undefined, undefined, dto.minimumStock);
      product.minimumStock = dto.minimumStock;
    }

    if (dto.description !== undefined) {
      if (typeof dto.description !== 'string') {
        throw new BadRequestException('La descripción debe ser texto');
      }
      product.description = dto.description.trim();
    }

    return product;
  }

  remove(id: number): { message: string } {
    this.findOne(id);
    this.products = this.products.filter((product) => product.id !== id);

    return { message: 'Producto eliminado correctamente' };
  }

  private validateNumbers(
    price?: number,
    quantity?: number,
    minimumStock?: number,
  ): void {
    if (
      price !== undefined &&
      (typeof price !== 'number' || !Number.isFinite(price) || price < 0)
    ) {
      throw new BadRequestException('El precio debe ser un número no negativo');
    }

    if (
      quantity !== undefined &&
      (!Number.isInteger(quantity) || quantity < 0)
    ) {
      throw new BadRequestException(
        'La cantidad debe ser un entero no negativo',
      );
    }

    if (
      minimumStock !== undefined &&
      (!Number.isInteger(minimumStock) || minimumStock < 0)
    ) {
      throw new BadRequestException(
        'El stock mínimo debe ser un entero no negativo',
      );
    }
  }
}

