export interface Product{
    id:number,
    name:string,
    price:number
}

export interface CartItem extends Product{
    quantity:number
}

export interface RootState{
    products:Product[],
    cart:CartItem[],
    user:string | null

}

