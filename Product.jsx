import React, { useContext, useEffect, useState } from "react";
import Breadcrums from "../Components/Breadcrums/Breadcrums";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";

const Product = () => {
  const { products } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    setProduct(products.find((e) => e.id === Number(productId)));
  }, [products, productId]);

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  return product ? (
    <div>
      <Breadcrums product={product} />
      <ProductDisplay
        product={product}
        selectedSize={selectedSize}
        onSizeSelect={handleSizeSelection}
      />
      <DescriptionBox />
      <RelatedProducts id={product.id} category={product.category} />
    </div>
  ) : null;
};

export default Product;
