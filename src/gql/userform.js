import { gql } from "@apollo/client";
export const ALL_USERFORM = gql`
  query MyQuery {
    user_appointment_form(order_by: { updated_at: desc }) {
      company_name
      created_at
      date_time
      descripiton
      email
      id
      phone
      updated_at
    }
    user_appointment_form_aggregate {
      aggregate {
        count
      }
    }
  }
`;
