import torch
import torch.nn as nn
import math


class EncoderTrans(nn.Module):
    def __init__(self):
        super().__init__()
        self.emb_data = nn.Embedding(num_embeddings=312, embedding_dim=15)
        self.emb_ind = nn.Embedding(7, 15)

        self.wq = nn.Linear(15, 15)
        self.wk = nn.Linear(15, 15)
        self.wv = nn.Linear(15, 15)

        self.sm1 = nn.Softmax(dim=-1)
        
        self.norm1 = nn.LayerNorm(normalized_shape=15)

        self.fw = nn.Sequential(
            nn.Linear(15, 15),
            nn.LeakyReLU(),
            nn.Linear(15, 15)
        )

        self.norm2 = nn.LayerNorm(normalized_shape=15)

    def forward(self, data):

        i = [[i for i in range(len(data[0]))]] * len(data)
        ind = torch.tensor(i)

        data_en = self.emb_data(data)
        ind_en = self.emb_ind(ind)
        
        inp = data_en + ind_en
        q = self.wq(inp)
        k = self.wk(inp)
        v = self.wv(inp)

        def per(q):
            q = torch.reshape(q, (2, 7, 3, 5))
            q = torch.permute(q, (0, 2, 1, 3))
            return q
        
        q_head = per(q)
        k_head = per(k)
        v_head = per(v)
        
        print("q_head: ", q_head.shape)
        print("k_head: ",k_head.shape)
        print("v_head: ",v_head.shape)

        k_head_T = k_head.permute(0, 1, 3, 2)
        by = torch.matmul(q_head, k_head_T)/math.sqrt(5) # vi moi head co 5 gia tri
        sm = self.sm1(by)
        value = torch.matmul(sm, v_head).permute(0, 2, 1, 3)
        out_multi = torch.reshape(value, (2, 7, 15))
        
        add1 = inp + out_multi
        norm1 = self.norm1(add1)
        
        fw = self.fw(norm1)

        add2 = norm1 + fw
        norm2 = self.norm2(add2)

        return norm2

if __name__ == "__main__":
    data = torch.tensor([
        [1, 56, 78, 89, 21, 15, 15],
        [78, 89, 65, 52, 35, 21, 29]
    ])

    model_en = EncoderTrans()
    rs = model_en(data)

    print(rs.shape)

