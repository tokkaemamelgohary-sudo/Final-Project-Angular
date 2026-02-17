export interface OrderDetails {
}


export interface OrderDetailsResponse {
  status: string
  session: OrderDetails
}

export interface OrderDetails {
  url: string
  success_url: string
  cancel_url: string
}
