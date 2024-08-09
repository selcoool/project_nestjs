// src/utils/response-data.util.ts

export interface ResponseData<D,M> {
    method?: M;
    status: boolean;
    data?: D;
    message?: string;
    error?: string;
  }
  
  export function successResponse<D,M>(method:M,data: D, message: string = 'Success'): ResponseData<D,M> {
    return {
      method,
      status: true,
      message,
      data
     
    };
  }
  
  export function errorResponse<D,M>(method:M,error: string, message: string = 'Error'): ResponseData<D,M> {
    return {
      method,
      status: false,
      error,
      message,
    };
  }
  