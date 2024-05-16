import { gql } from "@apollo/client";

//get service package
export const ALL_SERVICE_PACKAGE = gql`
  query MyQuery {
    service_package(order_by: { updated_at: desc }) {
      created_at
      id
      one_time_package_price
      recurrently_service_fee
      service_package_description
      service_package_type
      updated_at
    }
    service_package_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get service package id
export const SERVICE_PACKAGE_PK = gql`
  query MyQuery($id: Int!) {
    service_package_by_pk(id: $id) {
      created_at
      id
      one_time_package_price
      recurrently_service_fee
      service_package_description
      service_package_type
      updated_at
    }
  }
`;
//add service package
export const ADD_SERVICE_PACKAGE = gql`
  mutation add_service_package(
    $one_time_package_price: String!
    $service_package_description: String!
    $recurrently_service_fee: String!
    $service_package_type: String!
  ) {
    insert_service_package_one(
      object: {
        one_time_package_price: $one_time_package_price
        recurrently_service_fee: $recurrently_service_fee
        service_package_description: $service_package_description
        service_package_type: $service_package_type
      }
    ) {
      id
      one_time_package_price
      recurrently_service_fee
      service_package_description
      updated_at
    }
  }
`;
//edit service package
export const EDIT_SERVICE_PACKAGE = gql`
  mutation edit_service_package(
    $id: Int!
    $one_time_package_price: String!
    $service_package_description: String!
    $recurrently_service_fee: String!
    $service_package_type: String!
  ) {
    update_service_package_by_pk(
      pk_columns: { id: $id }
      _set: {
        one_time_package_price: $one_time_package_price
        recurrently_service_fee: $recurrently_service_fee
        service_package_description: $service_package_description
        service_package_type: $service_package_type
      }
    ) {
      created_at
      id
      one_time_package_price
      recurrently_service_fee
      service_package_type
      updated_at
      service_package_description
    }
  }
`;

//service category
export const SERVICE_CAT = gql`
  query aa {
    service_categories {
      id
      service_name
    }
  }
`;
