import axios from "axios";

const fetchAllRoles = async (accessToken) => {
    const rs = await axios.get(`http://localhost:8081/get-role`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )

    return rs;
}

export { fetchAllRoles }

