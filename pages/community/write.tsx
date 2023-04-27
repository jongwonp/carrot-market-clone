import Button from '@/components/button';
import Layout from '@/components/layouts';
import TextArea from '@/components/textarea';
import { NextPage } from 'next';

const Write: NextPage = () => {
  return (
    <Layout canGoBack>
      <form className="px-4 py-10">
        <TextArea placeholder="Ask a question!" required />
        <Button text="Submit" />
      </form>
    </Layout>
  );
};

export default Write;
