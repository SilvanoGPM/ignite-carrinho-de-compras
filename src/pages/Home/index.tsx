import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    const amount = sumAmount[product.id] ? sumAmount[product.id] + 1 : 1;
    return { ...sumAmount, [product.id]: amount };
  }, {} as CartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await api.get<Product[]>('/products');

        const products = data.map<ProductFormatted>((product) => ({
          ...product,
          priceFormatted: formatPrice(product.price),
        }));

        setProducts(products);
      } catch {
        toast.error('Aconteceu um erro ao tentar carregar os produtos!');
      }
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <ProductList>
      {products.map(({ id, image, title, priceFormatted }) => (
        <li key={id}>
          <img src={image} alt={title} />
          <strong>{title}</strong>
          <span>{priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
