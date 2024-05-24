import { gql } from "@apollo/client";

//get service package
export const ALL_SERVICE_PACKAGE = gql`
  query MyQuery($packageQuery: service_packages_bool_exp!) {
    service_packages(order_by: { updated_at: desc }, where: $packageQuery) {
      id
      recurrently_service_fee
      one_time_package_price
      service_package_description
      service_package_name
      service_package_type
      updated_at
      service_details_packages {
        service_details_packages {
          service_category {
            service_name
          }
        }
      }
    }
    service_packages_aggregate(where: $packageQuery) {
      aggregate {
        count
      }
    }
  }
`;

//get service package id
export const SERVICE_PACKAGE_PK = gql`
  query MyQuery($id: Int!) {
    service_packages_by_pk(id: $id) {
      id
      one_time_package_price
      recurrently_service_fee
      created_at
      service_package_name
      service_package_type
      service_package_description
      updated_at
      service_details_packages {
        service_details_packages {
          service_category {
            service_name
          }
        }
      }
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
    $service_package_name: String!
  ) {
    insert_service_packages_one(
      object: {
        one_time_package_price: $one_time_package_price
        recurrently_service_fee: $recurrently_service_fee
        service_package_description: $service_package_description
        service_package_type: $service_package_type
        service_package_name: $service_package_name
      }
    ) {
      id
      one_time_package_price
      recurrently_service_fee
      service_package_description
      updated_at
      service_package_name
    }
  }
`;
//edit service package
export const EDIT_SERVICE_PACKAGE = gql`
  mutation MyMutation(
    $id: Int!
    $one_time_package_price: String!
    $service_package_description: String!
    $recurrently_service_fee: String!
    $service_package_type: String!
    $service_package_name: String!
  ) {
    update_service_packages_by_pk(
      pk_columns: { id: $id }
      _set: {
        one_time_package_price: $one_time_package_price
        recurrently_service_fee: $recurrently_service_fee
        service_package_description: $service_package_description
        service_package_type: $service_package_type
        service_package_name: $service_package_name
      }
    ) {
      id
      one_time_package_price
      recurrently_service_fee
      service_package_description
      service_package_name
      service_package_type
    }
  }
`;

//add service package detials
export const SERVICE_PACKAGE_DETAILS = gql`
  mutation MyMutation(
    $fk_service_packages_id: Int!
    $fk_service_details_id: Int!
  ) {
    insert_service_details_packages_one(
      object: {
        fk_service_packages_id: $fk_service_packages_id
        fk_service_details_id: $fk_service_details_id
      }
    ) {
      fk_service_details_id
      fk_service_packages_id
      service_details_packages {
        service_category {
          service_name
        }
      }
    }
  }
`;
//delete servce package
export const DELETE_SERVICE_PACKAGE = gql`
  mutation daa($id: Int!) {
    delete_service_packages_by_pk(id: $id) {
      id
    }
  }
`;

//delete service details package
export const DELETE_SERVICE_DETIAILS_PACKAGE = gql`
  mutation daa($fk_service_packages_id: Int!) {
    delete_service_details_packages(
      where: { fk_service_packages_id: { _eq: $fk_service_packages_id } }
    ) {
      returning {
        id
      }
    }
  }
`;
