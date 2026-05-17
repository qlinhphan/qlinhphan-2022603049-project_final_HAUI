//  "address": "thanh hoa",
//         "age": 23,
//         "email": "doctor@gmail.com",
//         "idUser": "da6326e2-3d79-4c6c-94e8-09652c18079d",
//         "name": "linhss",
//         "password": "$2a$10$fYXmXPAtLVABfjQL2mkoNuElLZg5bEJ.cNwZbUApDPyx.lGTb.x1m",
//         "refreshToken": null,
//         "gender": "male"
import axios from "axios";

const apiCreateUser = async (accessToken, age, address, email, name, password, gender, roleName, phone) => {
    const form = new FormData()
    form.append("age", age)
    form.append("address", address)
    form.append("email", email)
    form.append("name", name)
    form.append("password", password)
    form.append("gender", gender)
    form.append("roleName", roleName)
    form.append("phone", phone)

    // return form

    const rs = await axios.post("http://localhost:8081/v1.1/users", form,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )
    return rs
}

const getAllUserAndPage = async (accessToken, page, limit) => {
    const rs = await axios.get(`http://localhost:8081/v1.1/users/all?page=${page}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )
    return rs
}

const deleteUserById = async (id) => {
    return axios.delete('http://localhost:8081/v1.1/users',
        {
            params: {
                id: id
            }
        }
    )
}

export { apiCreateUser, getAllUserAndPage, deleteUserById }
