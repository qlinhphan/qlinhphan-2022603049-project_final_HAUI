//  "address": "thanh hoa",
//         "age": 23,
//         "email": "doctor@gmail.com",
//         "idUser": "da6326e2-3d79-4c6c-94e8-09652c18079d",
//         "name": "linhss",
//         "password": "$2a$10$fYXmXPAtLVABfjQL2mkoNuElLZg5bEJ.cNwZbUApDPyx.lGTb.x1m",
//         "refreshToken": null,
//         "sex": "male"
import axios from "axios";

const apiCreateUser = (age, address, email, name, password, sex, roleName, phone) => {
    const form = new FormData()
    form.append("age", age)
    form.append("address", address)
    form.append("email", email)
    form.append("name", name)
    form.append("password", password)
    form.append("sex", sex)
    form.append("roleName", roleName)
    form.append("phone", phone)

    // return form

    const rs = axios.post("http://localhost:8081/v1.1/users", form)
    return rs

}

export { apiCreateUser }