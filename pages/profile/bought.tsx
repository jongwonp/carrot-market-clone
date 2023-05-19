import Layout from '@/components/layouts';
import ProductList from '@/components/product-list';
import { NextPage } from 'next';

const Bought: NextPage = () => {
  return (
    <Layout canGoBack title="구매내역">
      <div className="flex flex-col space-y-5 pb-10 divide-y">
        <ProductList kind="purchases" />
      </div>
    </Layout>
  );
};

export default Bought;
