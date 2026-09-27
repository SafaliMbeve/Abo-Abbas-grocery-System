import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { Title } from "@/components/ui/text";
import { getDiscountProducts } from "@/sanity/queries";

const DiscountPage = async() => {
  const products = await getDiscountProducts();
  return (
    <div className="py-10 bg-shop-light-bg">
      <Container>
        <Title className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">Discounts of the Week</Title>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {products.map((product)=>(
            <ProductCard key={product?._id} product={product}/>
          ))}
        </div>
      </Container>
    </div>
  )
}

export default DiscountPage;