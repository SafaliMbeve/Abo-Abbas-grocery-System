import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";
import HomeCategories from "@/components/HomeCategories";
import { getCategories } from "@/sanity/queries/index";
import ShopByBrands from "@/components/ShopByBrands";
import LatestBlog from "@/components/LatestBlog";

const page = async() => {
  const categories = await getCategories(6);
  console.log(categories);


  return (<Container className="py-6 sm:py-8 lg:py-10">
    <div className="space-y-12 sm:space-y-16 lg:space-y-20">
      <HomeBanner/>
      <ProductGrid/>
      <HomeCategories categories={categories}/>
      <ShopByBrands/>
      <LatestBlog/>
    </div>
  </Container>
  );

};

export default page;