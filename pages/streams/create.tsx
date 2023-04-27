import Button from '@/components/button';
import Input from '@/components/input';
import Layout from '@/components/layouts';
import TextArea from '@/components/textarea';
import type { NextPage } from 'next';

const Create: NextPage = () => {
  return (
    <Layout canGoBack>
      <form className=" space-y-5 py-10 px-4">
        <Input required label="Name" name="name" type="text" />
        <Input
          required
          label="Price"
          placeholder="0"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea name="description" label="Description" />
        <Button text="Go live" />
      </form>
    </Layout>
  );
};

export default Create;
