import { gql } from "@apollo/client";
//get all products
export const ALL_PRODUCTS = gql`
  query MyQuery($search: String!) {
    product_model(
      where: { model_name: { _ilike: $search } }
      order_by: { updated_at: desc }
    ) {
      created_at
      fk_product_brand_id
      fk_product_category_id
      id
      model_name
      product_description
      product_image_url
      product_model_brand {
        brand_name
        id
      }
      product_model_category {
        product_category_name
        id
      }
      product_specification
      updated_at
    }
    product_model_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get product by pk
export const PRODUCT_PK = gql`
  query MyQuery($id: Int!) {
    product_model_by_pk(id: $id) {
      created_at
      fk_product_category_id
      fk_product_brand_id
      id
      model_name
      product_description
      product_image_url
      product_model_brand {
        brand_name
        id
      }
      product_model_category {
        product_category_name
        id
      }
      product_specification
      updated_at
    }
  }
`;

//ADD Product
export const ADD_PRODUCUT = gql`
  mutation add_product(
    $fk_product_brand_id: Int!
    $fk_product_category_id: Int!
    $model_name: String!
    $product_description: String!
    $product_image_url: String!
    $product_specification: String!
  ) {
    insert_product_model(
      objects: {
        fk_product_brand_id: $fk_product_brand_id
        fk_product_category_id: $fk_product_category_id
        model_name: $model_name
        product_description: $product_description
        product_image_url: $product_image_url
        product_specification: $product_specification
      }
    ) {
      returning {
        created_at
        fk_product_brand_id
        fk_product_category_id
        id
        model_name
        product_description
        product_image_url
        product_specification
        updated_at
      }
    }
  }
`;

//update Product
export const EDIT_PRODUCUT = gql`
  mutation update_product(
    $id: Int!
    $fk_product_brand_id: Int!
    $fk_product_category_id: Int!
    $model_name: String!
    $product_description: String!
    $product_image_url: String!
    $product_specification: String!
  ) {
    update_product_model_by_pk(
      pk_columns: { id: $id }
      _set: {
        fk_product_brand_id: $fk_product_brand_id
        fk_product_category_id: $fk_product_category_id
        model_name: $model_name
        product_description: $product_description
        product_image_url: $product_image_url
        product_specification: $product_specification
      }
    ) {
      created_at
      fk_product_brand_id
      fk_product_category_id
      id
      model_name
      product_description
      product_image_url
      product_specification
      updated_at
    }
  }
`;

//delete product
export const DELETE_PRODUCT = gql`
  mutation MyMutation($id: Int!) {
    delete_product_model_by_pk(id: $id) {
      id
    }
  }
`;

//get product model
export const PRODUCT_MODEL = gql`
  query MyQuery {
    product_model {
      model_name
      id
    }
  }
`;

//get product brand
export const PRODUCT_BRAND = gql`
  query MyQuery {
    product_brand {
      brand_name
      id
    }
  }
`;

//get product category
export const PRODUCT_CATEGORY = gql`
  query MyQuery {
    product_category {
      product_category_name
      id
    }
  }
`;
