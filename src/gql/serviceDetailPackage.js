import { gql } from "@apollo/client";
export const ALL_SERVICE_DETAILS_PACKAGES = gql`
  query aa($fk_service_details_id: Int!) {
    service_details_packages(
      where: { fk_service_details_id: { _eq: $fk_service_details_id } }
    ) {
      id
      service_packages_details {
        id
        one_time_package_price
        recurrently_service_fee
        service_package_type
        service_package_name
        service_package_description
      }
      service_details_packages {
        service_category {
          service_name
        }
      }
    }
    service_details_packages_aggregate(
      where: { fk_service_details_id: { _eq: $fk_service_details_id } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

//delete service detail package
export const DELETE_SERVICE_DETAIL_PACKAGE = gql`
  mutation aa($id: Int!) {
    delete_service_details_packages_by_pk(id: $id) {
      id
    }
  }
`;
