import axios from "axios";

const apiLogin = async (email, password) => {
    const form = new FormData()
    form.append("email", email)
    form.append("password", password)

    // return form

    const rs = await axios.post("http://localhost:8081/login-app", form)
    return rs
}

const apiLogout = async (accessToken) => {

    const res = await axios.post(
        "http://localhost:8081/logout-app",
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return res;

};

export { apiLogin, apiLogout }