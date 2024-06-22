import { useState } from "react";
import {
  Layout,
  Button,
  Drawer,
  Form,
  Input,
  Table,
  Flex,
  Modal,
  Typography,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import TextArea from "antd/es/input/TextArea";
import { useMutation, useQuery } from "react-query";
import { Axios } from "../lib/axios";
import { slugify } from "../utils/slugify";
import parse from "html-react-parser";
import { Icons } from "../components/Icons";

type TCategoryRequest = {
  name: string;
  slug: string;
  icon: string;
};

type TCategoryResponse = TCategoryRequest & {
  id: number;
};

export function Categories() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState<TCategoryResponse | null>(
    null
  );
  const { handleSubmit, control, reset, setValue } =
    useForm<TCategoryRequest>();

  const { mutate, isLoading } = useMutation<
    TCategoryResponse,
    Error,
    TCategoryRequest
  >({
    mutationFn: (data) => Axios.post("categories", data),
  });

  const { mutate: updateMutation } = useMutation<
    TCategoryResponse,
    Error,
    TCategoryRequest
  >({
    mutationFn: (data) => Axios.patch(`categories/${editCategory?.id}`, data),
  });

  const { mutate: deleteMutation } = useMutation<
    TCategoryResponse,
    Error,
    number
  >({
    mutationFn: (id) => Axios.delete(`categories/${id}`),
  });

  const {
    data,
    isLoading: isCategoriesLoading,
    refetch,
  } = useQuery({
    queryFn: () => Axios.get("categories"),
  });

  function onSubmit(data: TCategoryRequest) {
    if (editCategory) {
      updateMutation(
        { ...data, slug: slugify(data.name) },
        {
          onSuccess: () => {
            setIsOpen(false);
            setEditCategory(null);
            refetch();
          },
          onError: () => console.log("hatolik"),
        }
      );
    } else {
      mutate(
        { ...data, slug: slugify(data.name) },
        {
          onSuccess: () => {
            setIsOpen(false);
            refetch();
          },
          onError: () => console.log("hatolik"),
        }
      );
    }
    reset();
  }

  function onDelete() {
    if (deleteCategory) {
      deleteMutation(deleteCategory, {
        onSuccess: () => {
          setDeleteCategory(null);
          refetch();
        },
        onError: () => console.log("hatolik"),
      });
    }
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Icon",
      render: (item) => parse(item.icon),
    },
    {
      title: "Actions",
      render: (item) => (
        <Flex gap={10}>
          <button
            onClick={() => {
              setIsOpen(true);
              setEditCategory(item);
              setValue("name", item.name);
              setValue("icon", item.icon);
            }}
          >
            <Icons.pen />
          </button>
          <button onClick={() => setDeleteCategory(item.id)}>
            <Icons.trash />
          </button>
        </Flex>
      ),
    },
  ];

  return (
    <Layout>
      <Button onClick={() => setIsOpen(true)}>add category</Button>

      <Table
        columns={columns}
        dataSource={data?.data}
        loading={isCategoriesLoading}
      />

      <Drawer
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditCategory(null);
          reset();
        }}
      >
        <Form onFinish={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={(register) => (
              <Input type="text" placeholder="name" {...register.field} />
            )}
          />
          <Controller
            name="icon"
            control={control}
            render={(register) => (
              <TextArea placeholder="icon" {...register.field} />
            )}
          />
          <Button htmlType="submit" isLoading={isLoading}>
            {!!editCategory ? "Edit" : "Submit"}
          </Button>
        </Form>
      </Drawer>

      <Modal
        open={!!deleteCategory}
        onCancel={() => setDeleteCategory(null)}
        onOk={onDelete}
      >
        <Typography>Are you sure to delete this category?</Typography>
      </Modal>
    </Layout>
  );
}
