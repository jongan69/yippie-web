// --------------------------------------
// Filename: src/app/api/detect/route.ts
// --------------------------------------

// import the Next.js headers
import { headers } from 'next/headers';

// import the NextResponse to be used for the returned API response 
import { NextResponse } from "next/server";

// interface for the new iterable headers object type
interface IResult {
    [key: string]: string
}

// The below function will return a valid key name of the header by removing 
// the '-' in the header names and applying camel case naming convention.
const createKey = (k: string) => {
    const kParts = k.split('-');

    // console.log(kParts);

    let newK = kParts[0];

    for(let n=1; n < kParts.length; n++) {
        kParts[n] = kParts[n].charAt(0).toUpperCase() + kParts[n].slice(1)
        newK += kParts[n];
    }

    return newK;

}

export async function GET(request: Request) {
    const headersList = headers();

    let result: IResult = {};

    // create the iterable headers object from key:value of the headers data
    Array.from(headersList.keys()).map((key: string) => {
        const v =  headersList.get(key);
        const nKey = createKey(key);
        Object.defineProperty(result, nKey, { value: v, writable: false, enumerable: true });
      })

    // return new Response as JSON object
    return NextResponse.json(result);
}