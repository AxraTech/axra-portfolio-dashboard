import { gql } from "@apollo/client";
//get service
export const ALL_SERVICES = gql`
  query MyQuery {
    service_detail_package {
      fk_service_detail_id
      fk_service_package_id
      id
      created_at
      service_detail_package {
        one_time_package_price
        recurrently_service_fee
        service_package_description
        service_package_type
        id
      }
      service_package_detail {
        banner_image_url
        image_url
        service_description
        service_name
        id
      }
    }
    service_detail_package_aggregate {
      aggregate {
        count
      }
    }
  }
`;
//get service pk
export const SERVICE_PK = gql`
  query MyQuery($id: Int!) {
    service_detail_package_by_pk(id: $id) {
      service_detail_package {
        id
        one_time_package_price
        recurrently_service_fee
        service_package_description
        service_package_type
      }
      service_package_detail {
        banner_image_url
        image_url
        service_description
        service_name
      }
      fk_service_package_id
      fk_service_detail_id
    }
  }
`;

//add service
export const ADD_SERVICE = gql`
  mutation MyMutation {
    insert_service_detail_package_one(
      object: {
        created_at: "2023-07-27T07:01:04.302364+00:00"
        fk_service_detail_id: 2
        fk_service_package_id: 2
        updated_at: "2023-07-27T07:01:04.302364+00:00"
        id: 8
      }
    ) {
      created_at
      fk_service_detail_id
      fk_service_package_id
      id
    }
  }
`;

//get service detail name
export const SERVICE_DETAIL_NAME = gql`
  query MyQuery {
    service_detail {
      id
      service_name
      image_url
      banner_image_url
      service_description
    }
  }
`;

//get service package
export const SERVICE_PACKAGE = gql`
  query MyQuery {
    service_package {
      one_time_package_price
      recurrently_service_fee
      service_package_description
      service_package_type
      id
    }
  }
`;

//delete service package
export const DELETE_SERVICE_PACKAGE = gql`
  mutation MyMutation($id: Int!) {
    delete_service_package_by_pk(id: $id) {
      id
    }
  }
`;
