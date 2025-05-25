# Ví Dụ Về Các Cách Sắp Xếp Services

## 1. Sắp Xếp Theo Thành Phố Trước, Rating Sau

### API: `GET /api/services/by-city`

**Cách hoạt động:**
1. **Bước 1:** Nhóm tất cả services theo thành phố
2. **Bước 2:** Sắp xếp các thành phố theo thứ tự A-Z
3. **Bước 3:** Trong mỗi thành phố, sắp xếp services theo rating cao đến thấp

**Kết quả mẫu:**
```json
{
  "status": 200,
  "message": "Get services by city successfully",
  "data": [
    {
      "city": "Đà Nẵng",
      "totalServices": 3,
      "cityAverageRating": 4.2,
      "services": [
        {
          "serviceId": "service1",
          "serviceTitle": "Massage Thái",
          "averageRating": 4.8,
          "businessName": "Spa ABC"
        },
        {
          "serviceId": "service2", 
          "serviceTitle": "Chăm sóc da",
          "averageRating": 4.1,
          "businessName": "Beauty Center"
        },
        {
          "serviceId": "service3",
          "serviceTitle": "Cắt tóc",
          "averageRating": 3.7,
          "businessName": "Hair Salon"
        }
      ]
    },
    {
      "city": "Hà Nội",
      "totalServices": 4,
      "cityAverageRating": 4.5,
      "services": [
        {
          "serviceId": "service4",
          "serviceTitle": "Nail Art",
          "averageRating": 4.9,
          "businessName": "Nail Studio"
        },
        {
          "serviceId": "service5",
          "serviceTitle": "Massage",
          "averageRating": 4.6,
          "businessName": "Relax Spa"
        },
        {
          "serviceId": "service6",
          "serviceTitle": "Facial",
          "averageRating": 4.2,
          "businessName": "Beauty House"
        },
        {
          "serviceId": "service7",
          "serviceTitle": "Waxing",
          "averageRating": 4.0,
          "businessName": "Skin Care"
        }
      ]
    },
    {
      "city": "Hồ Chí Minh",
      "totalServices": 2,
      "cityAverageRating": 4.3,
      "services": [
        {
          "serviceId": "service8",
          "serviceTitle": "Spa Package",
          "averageRating": 4.7,
          "businessName": "Luxury Spa"
        },
        {
          "serviceId": "service9",
          "serviceTitle": "Hair Treatment",
          "averageRating": 3.9,
          "businessName": "Hair Expert"
        }
      ]
    }
  ],
  "total": 3,
  "totalServices": 9
}
```

## 2. Sắp Xếp Đồng Thời City và Rating

### API: `GET /api/services/sorted-by-city-rating`

**Cách hoạt động:**
- Sắp xếp tất cả services theo city (A-Z) và rating (cao đến thấp) cùng lúc
- Kết quả là danh sách phẳng (flat list)

**Kết quả mẫu:**
```json
{
  "status": 200,
  "message": "Get services sorted by city and rating successfully",
  "data": [
    {
      "_id": "service1",
      "city": "Đà Nẵng",
      "serviceTitle": "Massage Thái",
      "averageRating": 4.8,
      "businessName": "Spa ABC"
    },
    {
      "_id": "service2",
      "city": "Đà Nẵng", 
      "serviceTitle": "Chăm sóc da",
      "averageRating": 4.1,
      "businessName": "Beauty Center"
    },
    {
      "_id": "service3",
      "city": "Đà Nẵng",
      "serviceTitle": "Cắt tóc",
      "averageRating": 3.7,
      "businessName": "Hair Salon"
    },
    {
      "_id": "service4",
      "city": "Hà Nội",
      "serviceTitle": "Nail Art",
      "averageRating": 4.9,
      "businessName": "Nail Studio"
    },
    {
      "_id": "service5",
      "city": "Hà Nội",
      "serviceTitle": "Massage",
      "averageRating": 4.6,
      "businessName": "Relax Spa"
    }
  ],
  "total": 5
}
```

## So Sánh Hai Cách Tiếp Cận

| Tiêu chí | `/services/by-city` | `/services/sorted-by-city-rating` |
|----------|---------------------|-----------------------------------|
| **Cấu trúc dữ liệu** | Nhóm theo thành phố | Danh sách phẳng |
| **Thống kê** | Có thống kê cho mỗi thành phố | Không có thống kê |
| **Hiển thị UI** | Phù hợp cho group/section | Phù hợp cho list/table |
| **Performance** | Tốt cho phân trang theo city | Tốt cho phân trang tổng thể |
| **Use case** | Dashboard, báo cáo | Search results, listing |

## Tham Số Query

### `/services/by-city`
- `city`: Lọc theo thành phố cụ thể
- `minRating`: Rating tối thiểu
- `limitPerCity`: Giới hạn số services mỗi thành phố

**Ví dụ:**
```
GET /api/services/by-city?minRating=4.0&limitPerCity=5
GET /api/services/by-city?city=Hà Nội&limitPerCity=3
```

### `/services/sorted-by-city-rating`
- `city`: Lọc theo thành phố cụ thể  
- `minRating`: Rating tối thiểu
- `limit`: Giới hạn tổng số kết quả

**Ví dụ:**
```
GET /api/services/sorted-by-city-rating?minRating=4.0&limit=10
GET /api/services/sorted-by-city-rating?city=Hồ Chí Minh
```

## Khi Nào Sử Dụng API Nào?

### Sử dụng `/services/by-city` khi:
- Muốn hiển thị services theo từng thành phố riêng biệt
- Cần thống kê cho mỗi thành phố
- Tạo dashboard hoặc báo cáo
- Hiển thị dạng accordion/tabs theo thành phố

### Sử dụng `/services/sorted-by-city-rating` khi:
- Muốn danh sách services đơn giản
- Tạo trang search results
- Hiển thị dạng table/list
- Cần phân trang đơn giản 