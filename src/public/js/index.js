const socket = io();

const divallProductsSocket = document.getElementById("allProductsSocket")
    
    socket.on("update",products=>{
        divallProductsSocket.innerHTML = "";
        products.forEach(element => {
            divallProductsSocket.innerHTML += "id:"+element.id+" -";
            divallProductsSocket.innerHTML += "title:"+element.title+" -";
            divallProductsSocket.innerHTML += "description:"+element.description+" -";
            divallProductsSocket.innerHTML += "price:"+element.price+" -";
            divallProductsSocket.innerHTML += "code:"+element.code+" -";
            divallProductsSocket.innerHTML += "stock:"+element.stock+" -";
            divallProductsSocket.innerHTML += "status:"+element.status+" -";
            divallProductsSocket.innerHTML += "category:"+element.category+"<br>";
        });

})