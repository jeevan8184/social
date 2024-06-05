import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string'
import { RemoveUrlQueryParams, formUrlParams } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formUrlQuery=({params,key,value}:formUrlParams)=> {

  let currentUrl=qs.parse(params);
  currentUrl[key]=value;

  return qs.stringifyUrl(
    {
      url:window.location.pathname,
      query:currentUrl
    },
    {skipNull:true}
  )

}

export const removeKeysFromQuery=({params,keysToRemove}:RemoveUrlQueryParams)=> {

  let currentUrl=qs.parse(params);

  keysToRemove.forEach((key)=> (
    delete currentUrl[key]
  ))

  return qs.stringifyUrl(
    {
      url:window.location.pathname,
      query:currentUrl
    },
    {skipNull:true}
  )
}

export const formatDateTimeOpt=(newDate:Date)=> {

  const dateTimeOptions:Intl.DateTimeFormatOptions={
    year:'numeric',
    month:'short',
    day:'numeric',
    hour12:true,
    hour:'numeric',
    minute:'numeric'
  }
  const dateOptions:Intl.DateTimeFormatOptions={
    month:'short',
    day:'numeric',
    weekday:'short',
    year:'numeric'
  }
  const timeOptions:Intl.DateTimeFormatOptions={
    hour:'numeric',
    minute:'numeric',
    hour12:true
  }

  const date=new Date();

  const formatDateTime=new Date(newDate).toLocaleString('en-Us',dateTimeOptions);
  const formatDate=new Date(newDate).toLocaleString('en-Us',dateOptions);
  const formatTime=new Date(newDate).toLocaleString('en-Us',timeOptions);

  return {
    dateTimeOnly:formatDateTime,
    dateOnly:formatDate,
    timeOnly:formatTime
  }
}
