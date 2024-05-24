//service category
import { gql } from "@apollo/client";
export const SERVICE_CAT = gql`
  query aa {
    service_categories {
      id
      service_name
    }
  }
`;
//service category by name
export const SERVICE_CAT_BY_NAME = gql`
  query aa($service_name: String!) {
    service_details(
      where: { service_category: { service_name: { _eq: $service_name } } }
    ) {
      id
      service_category {
        service_name
      }
    }
  }
`;
//service category by service detail id
export const SERVICE_CAT_BY_DETAIL_ID = gql`
  query aa($fk_service_details_id: Int!) {
    service_categories(
      where: {
        service_details: {
          service_details_service_details_packages: {
            fk_service_details_id: { _eq: $fk_service_details_id }
          }
        }
      }
    ) {
      id
      service_name
    }
  }
`;

export const SERVICE_CAT_BY_PK = gql`
  query serdfsf($id: Int!) {
    service_categories(where: { id: { _eq: $id } }) {
      id
      service_name
    }
  }
`;
