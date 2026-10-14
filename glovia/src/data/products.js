const products = [
    {
      id: 1,
      name: "Hydrating Face Serum",
      category: "Face Care",
      price: 599,
      rating: 4.8,
      Image:
        "https://i.pinimg.com/736x/b4/21/ca/b421cadccc346f88930d7ae4f7d536a3.jpg",
    },
    {
      id: 2,
      name: "Vitamin C Face Wash",
      category: "Face Care",
      price: 349,
      rating: 4.6,
      Image:
        "https://i.pinimg.com/736x/a6/86/90/a6869093df50b08bbf8fbd18317d200d.jpg",
    },
    {
      id: 3,
      name: "Rose Glow Moisturizer",
      category: "Face Care",
      price: 499,
      rating: 4.7,
      Image:
        "https://i.pinimg.com/736x/43/50/55/435055de1f71d58706448ab27f80168e.jpg",
    },
    {
      id: 4,
      name: "Niacinamide Face Serum",
      category: "Face Care",
      price: 649,
      rating: 4.9,
      Image:
        "https://i.pinimg.com/736x/ee/83/ab/ee83abd47d015f171ec06b7003c5c2ff.jpg",
    },
    {
      id: 5,
      name: "Silky Hair Serum",
      category: "Hair Care",
      price: 449,
      rating: 4.7,
      Image:
        "https://i.pinimg.com/736x/4a/58/1b/4a581b69de0742be200f3cccd820452b.jpg",
    },
    {
      id: 6,
      name: "Nourishing Hair Mask",
      category: "Hair Care",
      price: 549,
      rating: 4.6,
      Image:
        "https://i.pinimg.com/1200x/d0/93/b9/d093b912b4da036566477e49019eba86.jpg",
    },
    {
      id: 7,
      name: "Argan Hair Oil",
      category: "Hair Care",
      price: 399,
      rating: 4.5,
      Image:
        "https://i.pinimg.com/1200x/87/8b/ea/878beae483762440b86cbbb7d757d44b.jpg",
    },
    {
      id: 8,
      name: "Gentle Body Wash",
      category: "Body Care",
      price: 399,
      rating: 4.6,
      Image:
        "https://i.pinimg.com/1200x/d9/90/4a/d9904aebb68408e72b9a624e8c41f58d.jpg",
    },
    {
      id: 9,
      name: "Shea Body Lotion",
      category: "Body Care",
      price: 449,
      rating: 4.7,
      Image:
        "https://i.pinimg.com/736x/f5/49/48/f5494809206ba2df2204640c2abda966.jpg",
    },
    {
      id: 10,
      name: "Exfoliating Body Scrub",
      category: "Body Care",
      price: 499,
      rating: 4.5,
      Image:
        "https://i.pinimg.com/1200x/56/f1/45/56f145cf78ae3d59d7451c79541ff892.jpg",
    },
    {
      id: 11,
      name: "Daily Sunscreen SPF 50",
      category: "Sun Care",
      price: 699,
      rating: 4.9,
      Image:
        "https://i.pinimg.com/736x/14/6b/36/146b36cb820a91e6cc47cab3d4a263f8.jpg",
    },
    {
      id: 12,
      name: "Matte Sunscreen SPF 40",
      category: "Sun Care",
      price: 599,
      rating: 4.7,
      Image:
        "https://i.pinimg.com/736x/1b/c6/ca/1bc6cae21aab1e72073f4b4e5b699da7.jpg",
    },
    {
      id: 13,
      name: "Aloe Sun Protection Gel",
      category: "Sun Care",
      price: 449,
      rating: 4.6,
      Image:
        "https://i.pinimg.com/1200x/b2/85/30/b28530fe5eddea35514defe6aaa1febe.jpg",
    },
    {
      id: 14,
      name: "Rose Lip Balm",
      category: "Lip Care",
      price: 199,
      rating: 4.5,
      Image:
        "https://i.pinimg.com/736x/eb/88/0a/eb880a15b3c497831a0365406c61cf37.jpg",
    },
    {
      id: 15,
      name: "Berry Lip Mask",
      category: "Lip Care",
      price: 299,
      rating: 4.7,
      Image:
        "https://i.pinimg.com/736x/fb/04/fd/fb04fd61c99b4f2fa0ba6c21ed38c574.jpg",
    },
    {
      id: 16,
      name: "Tinted Lip Moisturizer",
      category: "Lip Care",
      price: 249,
      rating: 4.6,
      Image:
        "https://i.pinimg.com/736x/f7/c2/83/f7c28390c4a7908687d5053e79fa6404.jpg",
    },
    {
      id: 17,
      name: "Daily Grooming Kit",
      category: "Grooming",
      price: 799,
      rating: 4.8,
      Image:
        "https://i.pinimg.com/736x/e4/5f/d0/e45fd056b154c0483863f1b01d0b8794.jpg",
    },
    {
      id: 18,
      name: "Gentle Face & Beard Wash",
      category: "Grooming",
      price: 399,
      rating: 4.5,
      Image:
        "https://i.pinimg.com/1200x/a5/9b/7b/a59b7b66f7f022e1d96639e432e15dc9.jpg",
    },
    {
      id: 19,
      name: "Beard Care Oil",
      category: "Grooming",
      price: 349,
      rating: 4.6,
      Image:
        "https://i.pinimg.com/1200x/07/23/dd/0723ddaa41e5d6f91107838b4de6f280.jpg",
    },
    {
      id: 20,
      name: "Refreshing Grooming Cream",
      category: "Grooming",
      price: 449,
      rating: 4.7,
      Image:
        "https://i.pinimg.com/1200x/6f/91/26/6f9126a5f49724a83472599651890629.jpg",
    },
    {
      id: 21,
      name: "Hyaluronic Glow Cream",
      category: "Face Care",
      price: 579,
      rating: 4.8,
      Image:
        "https://i.pinimg.com/736x/b4/dc/b8/b4dcb83e1d309aa97a4bcf33d1db4355.jpg",
    },
    {
      id: 22,
      name: "Aloe Vera Face Toner",
      category: "Face Care",
      price: 329,
      rating: 4.6,
      Image:
        "https://i.pinimg.com/1200x/bb/1b/8b/bb1b8ba0053065ba127129747f8c3167.jpg",
    },
    {
      id: 23,
      name: "Coconut Repair Shampoo",
      category: "Hair Care",
      price: 449,
      rating: 4.7,
      Image:
        "https://i.pinimg.com/736x/fb/67/49/fb6749628a34e9cdda0d193a07194c62.jpg",
    },
    {
      id: 24,
      name: "Keratin Smooth Conditioner",
      category: "Hair Care",
      price: 499,
      rating: 4.8,
      Image:
        "https://i.pinimg.com/736x/e1/c0/3d/e1c03dc98baa90349212646d7b467957.jpg",
    },
    {
      id: 25,
      name: "Vanilla Body Butter",
      category: "Body Care",
      price: 529,
      rating: 4.8,
      Image:
        "https://i.pinimg.com/1200x/ca/42/3c/ca423c4c87b00509de8d22e35fec80bb.jpg",
    },
    {
      id: 26,
      name: "Coffee Body Polish",
      category: "Body Care",
      price: 459,
      rating: 4.6,
      Image:
        "https://i.pinimg.com/1200x/b1/ee/9e/b1ee9e0f07aeee203d68ae3b7a1b35ea.jpg",
    },
    {
      id: 27,
      name: "Hydrating Sunscreen SPF 50",
      category: "Sun Care",
      price: 649,
      rating: 4.8,
      Image:
        "https://i.pinimg.com/736x/a9/27/f1/a927f1bf094ade7660ca58c63a06cba5.jpg",
    },
    {
      id: 28,
      name: "Vitamin E Sun Cream SPF 30",
      category: "Sun Care",
      price: 499,
      rating: 4.6,
      Image:
        "https://i.pinimg.com/736x/d3/2d/cf/d32dcf43d2f16b09be53c51cd4a49272.jpg",
    },
    {
      id: 29,
      name: "Strawberry Lip Scrub",
      category: "Lip Care",
      price: 229,
      rating: 4.7,
      Image:
        "https://i.pinimg.com/1200x/bf/b1/6b/bfb16b6d40b8a1ebb6cfd00d366040b6.jpg",
    },
    {
      id: 30,
      name: "Cocoa Lip Butter",
      category: "Lip Care",
      price: 279,
      rating: 4.8,
      Image:
        "https://i.pinimg.com/736x/5a/25/a7/5a25a788737a38920c617cd0a1e1be01.jpg",
    },
    {
      id: 31,
      name: "Precision Grooming Trimmer",
      category: "Grooming",
      price: 899,
      rating: 4.8,
      Image:
        "https://i.pinimg.com/736x/ad/1f/80/ad1f802cc50fffc6380de82a5c177596.jpg",
    },
    {
      id: 32,
      name: "After Shave Soothing Balm",
      category: "Grooming",
      price: 379,
      rating: 4.7,
      Image:
        "https://i.pinimg.com/736x/63/ae/bf/63aebfca7e8d9f843d123388142b74c6.jpg",
    },
  ];
  export default products;