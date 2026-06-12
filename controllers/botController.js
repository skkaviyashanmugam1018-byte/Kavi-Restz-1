const Session = require("../models/Session");
const Order = require("../models/Order");
const {
  sendText,
  sendButtons,
  sendList,
  sendDeliveryFlow,
} = require("../config/whatsapp");

// ═══════════════════════════════════════════════════════════
// MENU DATA — from kavirestaurant.in
// ═══════════════════════════════════════════════════════════
const MENU = {
  soup: {
    label: "🍲 Soup",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Download_Food_in_plate_isolated_for_free-removebg-preview.png",
    items: [
      { id: "hot_sour_veg_soup",   name: "Hot & Sour Veg Soup",   price: 80,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Veg_Hot_and_Sour_Soup-450x450.png" },
      { id: "sweet_corn_veg_soup", name: "Sweet Corn Veg Soup",   price: 80,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Sweet-Corn-Veg-Soup-450x450.png" },
      { id: "veg_clear_soup",      name: "Veg Clear Soup",         price: 80,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Veg-Clear-Soup-450x450.png" },
      { id: "crab_soup",           name: "Crab Soup",              price: 120, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Crab-Soup-450x450.png" },
      { id: "chicken_clear_soup",  name: "Chicken Clear Soup",     price: 100, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Chicken-Clear-Soup-375x450.png" },
    ],
  },
  starters: {
    label: "🍢 Starters",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png",
    items: [
      { id: "french_fries",        name: "French Fries",              price: 120, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/French-Fries-450x450.png" },
      { id: "gobi_65",             name: "Gobi 65",                   price: 150, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Gobi-65-450x450.webp" },
      { id: "mushroom_65",         name: "Mushroom 65",               price: 150, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Mushroom-65-450x450.webp" },
      { id: "chilly_chicken_bl",   name: "Chilly Chicken (Boneless)", price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Chilly-Chicken-Boneless-450x450.png" },
      { id: "chicken_tikka",       name: "Chicken Tikka",             price: 180, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/chicken-tikka-450x408.png" },
      { id: "chicken_65_bl",       name: "Chicken 65 (Boneless)",     price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Chicken-65-With-Bone-450x450.png" },
      { id: "chicken_65_wb",       name: "Chicken 65 (With Bone)",    price: 170, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/chicken_65_andhra_style-removebg-preview-1.png" },
      { id: "honey_chicken",       name: "Honey Chicken",             price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Honey-Chicken-450x450.png" },
      { id: "chicken_lollipop",    name: "Chicken Lollipop (5pcs)",   price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Chicken-Lollipop-5-pcs-450x409.png" },
      { id: "dragon_chicken",      name: "Dragon Chicken",            price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Dragon-Chicken-450x450.png" },
      { id: "chicken_kola_urundai",name: "Chicken Kola Urundai",      price: 160, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Mutton_Kola_Urundai-removebg-preview-450x450.png" },
      { id: "alfaham_chicken",     name: "Alfaham Chicken",           price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Alfaham-Chicken-450x407.png" },
    ],
  },
  bbq_grill: {
    label: "🔥 BBQ / Grill",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png",
    items: [
      { id: "grill_chicken_full",    name: "Grill Chicken - Full",      price: 460, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken-450x450.png" },
      { id: "grill_chicken_half",    name: "Grill Chicken - Half",      price: 240, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken-450x450.png" },
      { id: "grill_chicken_quarter", name: "Grill Chicken - Quarter",   price: 130, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken-450x450.png" },
      { id: "bbq_juicy_wings",       name: "BBQ Juicy Wings 5pcs",      price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/BBQ-Boneless-Strips-5pcs-450x450.jpg" },
      { id: "bbq_drumstick_2pcs",    name: "BBQ Drumstick Chicken 2pcs",price: 180, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Barbecue-Chicken-Drumsticks-450x450.jpg" },
    ],
  },
  tandoori: {
    label: "🍗 Tandoori",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Tandorri.png",
    items: [
      { id: "tandoori_full",       name: "Tandoori Chicken - Full",          price: 480, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Delicious-Kerala-Style-Chicken-Roast-Recipe-450x450.jpg" },
      { id: "tandoori_half",       name: "Tandoori Chicken - Half",          price: 250, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Delicious-Kerala-Style-Chicken-Roast-Recipe-450x450.jpg" },
      { id: "tandoori_quarter",    name: "Tandoori Chicken - Quarter",       price: 130, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Delicious-Kerala-Style-Chicken-Roast-Recipe-450x450.jpg" },
      { id: "chicken_tikka_7pcs",  name: "Chicken Tikka 7pcs (Malai)",       price: 480, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken-Malai-Tikka-450x450.jpg" },
      { id: "drumstick_4pcs",      name: "Drumstick Chicken 4pcs",           price: 280, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Delicious-Golden-Fried-Chicken-Drumsticks-Served-on-a-White-Plate-for-Savory-Dining-Experience-450x450.jpg" },
      { id: "fish_tikka",          name: "Fish Tikka",                        price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Grilled-Fish-Tikka-for-Weightloss-Flavor-Quotient-450x450.jpg" },
      { id: "prawns_tikka",        name: "Prawns Tikka",                      price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Prawns-Tikka-450x450.jpg" },
    ],
  },
  fried_chicken: {
    label: "🍗 Fried Chicken",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png",
    items: [
      { id: "bucket_5pcs",      name: "Bucket 5pcs",        price: 450, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Download-Bucket-of-Fried-Chicken-for-free-450x450.jpg" },
      { id: "bucket_10pcs",     name: "Bucket 10pcs",       price: 450, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Download-Bucket-of-Fried-Chicken-for-free-450x450.jpg" },
      { id: "lolipop_5pcs",     name: "Lolipop 5pcs",       price: 250, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken-Lolly-Stock-Photos-Free-Royalty-Free-Stock-Photos-from-Dreamstime-450x450.jpg" },
      { id: "wings_5pcs",       name: "Wings 5pcs",         price: 250, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-12-450x450.jpg" },
      { id: "boneless_strips",  name: "Boneless Strips 5pcs",price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-13-450x450.jpg" },
      { id: "popcorn",          name: "Popcorn",            price: 160, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken-Popcorn-450x450.jpg" },
    ],
  },
  briyani: {
    label: "🍛 Briyani",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Briyani.png",
    items: [
      { id: "mutton_briyani",   name: "Mutton Biriyani",         price: 280, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Mutton-Biriyani-450x450.jpg" },
      { id: "chicken_briyani",  name: "Chicken Biriyani",        price: 150, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken-Biriyani-450x450.jpg" },
      { id: "prawn_briyani",    name: "Prawn Biriyani",          price: 150, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Prawn-Biryani-450x450.jpg" },
      { id: "egg_briyani",      name: "Egg Biriyani",            price: 120, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Egg-Biryani-1-450x450.png" },
      { id: "plain_briyani",    name: "Plain Biriyani (Kuska)",  price: 100, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Briyani.png" },
    ],
  },
  bucket_briyani: {
    label: "🪣 Bucket Briyani",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Briyani.png",
    items: [
      { id: "bucket_mutton_full",    name: "Bucket Mutton Full (8 Persons)",   price: 2700, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Mutton-Biriyani-450x450.jpg" },
      { id: "bucket_mutton_half",    name: "Bucket Mutton Half (4 Persons)",   price: 1500, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Mutton-Biriyani-450x450.jpg" },
      { id: "bucket_chicken_full",   name: "Bucket Chicken Full (8 Persons)",  price: 2100, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken-Biriyani-450x450.jpg" },
      { id: "bucket_chicken_half",   name: "Bucket Chicken Half (4 Persons)",  price: 1200, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken-Biriyani-450x450.jpg" },
    ],
  },
  dry_fry: {
    label: "🍖 Dry / Fry",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Mutton-2.png",
    items: [
      { id: "mutton_sukka",          name: "Mutton Sukka",              price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Mutton-2.png" },
      { id: "karaikudi_sukka",       name: "Karaikudi Chicken Sukka",   price: 180, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png" },
      { id: "pepper_chicken_dry",    name: "Pepper Chicken Dry",        price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png" },
      { id: "chilly_chicken_dry",    name: "Chilly Chicken Dry",        price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png" },
      { id: "schezwan_chicken",      name: "Schezwan Chicken",          price: 210, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png" },
      { id: "egg_pepper_fry",        name: "Egg Pepper Fry",            price: 120, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Mutton-2.png" },
      { id: "gobi_manchurian_dry",   name: "Gobi Manchurian Dry",       price: 180, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Gobi-65-450x450.webp" },
      { id: "paneer_manchurian_dry", name: "Paneer Manchurian Dry",     price: 180, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Mutton-2.png" },
      { id: "era_thokku",            name: "Era Thokku",                price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Seafoods.png" },
      { id: "chicken_chettinad_dry", name: "Chicken Chettinadu Masala", price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png" },
      { id: "tawa_vanjaram",         name: "Tawa Vanjaram Fry",         price: 150, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Tawa-Vanjaram-Fry-450x450.png" },
    ],
  },
  gravy: {
    label: "🫕 Gravy",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Mutton-2.png",
    items: [
      { id: "butter_chicken_bl",       name: "Butter Chicken Masala BL",     price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png" },
      { id: "chicken_tikka_masala",    name: "Chicken Tikka Masala BL",      price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png" },
      { id: "pepper_chicken_gravy",    name: "Pepper Chicken Gravy",         price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png" },
      { id: "chettinad_chicken_gravy", name: "Chettinadu Chicken Gravy",     price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png" },
      { id: "kadai_chicken_gravy",     name: "Kadai Chicken Gravy",          price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png" },
      { id: "chicken_manchurian_bl",   name: "Chicken Manchurian Gravy BL",  price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png" },
      { id: "schezwan_chicken_gravy",  name: "Schezwan Chicken Gravy",       price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Chicken.png" },
      { id: "mutton_masala_bone",      name: "Mutton Masala Bone",           price: 300, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Mutton-2.png" },
      { id: "manchatti_meen",          name: "Manchatti Meen Kuzhambu",      price: 160, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Manchatti-Meen-Kuzhambu.png" },
      { id: "veg_kadai",               name: "Veg Kadai",                    price: 180, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Mutton-2.png" },
      { id: "kadai_paneer",            name: "Kadai Paneer",                 price: 180, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Mutton-2.png" },
      { id: "paneer_butter_masala",    name: "Paneer Butter Masala",         price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Mutton-2.png" },
      { id: "dal_fry",                 name: "Dal Fry",                      price: 180, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Mutton-2.png" },
    ],
  },
  seafoods: {
    label: "🦞 Seafoods",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Seafoods.png",
    items: [
      { id: "nethili_fish_fry",   name: "Nethili Fish Fry",       price: 160, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Seafoods.png" },
      { id: "vanjaram_masala",    name: "Vanjaram Fish Masala",   price: 180, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Vanjaram-Fish-Masala-450x450.webp" },
      { id: "vila_meen_fry",      name: "Vila Meen Fish Fry",     price: 160, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Vila-Meen-Fish-Fry-450x450.webp" },
      { id: "vaval_fish_fry",     name: "Vaval Fish Fry",         price: 250, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Vaval-Fish-Fry-450x450.webp" },
      { id: "tawa_vanjaram_fry",  name: "Tawa Vanjaram Fry",      price: 150, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Tawa-Vanjaram-Fry-450x450.png" },
      { id: "meen_polichathu",    name: "Meen Polichathu",        price: 250, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Meen-Polichathu-450x450.webp" },
      { id: "special_fish_fry",   name: "Special Fish Fry",       price: 300, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Special-Fish-Fry-450x450.webp" },
      { id: "boiled_fish_2",      name: "Boiled Fish (2 Fish)",   price: 300, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Boiled-Fish-2-Fish-450x450.webp" },
      { id: "crab_masala",        name: "Crab Masala",            price: 300, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Seafoods.png" },
      { id: "squid_masala",       name: "Squid Masala",           price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Squid-Masala-450x450.webp" },
      { id: "prawns_fry",         name: "Prawns Fry",             price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Seafoods.png" },
      { id: "prawns_masala",      name: "Prawns Masala",          price: 250, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Seafoods.png" },
      { id: "prawns_pepper_fry",  name: "Prawns Pepper Fry",      price: 230, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Seafoods.png" },
      { id: "prawns_65",          name: "Prawns 65",              price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Seafoods.png" },
    ],
  },
  indian_breads: {
    label: "🫓 Indian Breads",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Butter-Rotti.webp",
    items: [
      { id: "chappathi",           name: "Chappathi Set",           price: 50,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Butter-Rotti.webp" },
      { id: "parotta_set",         name: "Parotta Set",             price: 50,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Butter-Rotti.webp" },
      { id: "veechu_parotta",      name: "Veechu Parotta",          price: 50,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Butter-Rotti.webp" },
      { id: "egg_veechu_parotta",  name: "Egg Veechu Parotta",      price: 70,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Butter-Rotti.webp" },
      { id: "egg_kothu_parotta",   name: "Egg Kothu Parotta",       price: 140, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Butter-Rotti.webp" },
      { id: "chicken_kothu_parotta",name: "Chicken Kothu Parotta",  price: 180, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Butter-Rotti.webp" },
      { id: "chilly_parotta",      name: "Chilly Parotta",          price: 130, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Butter-Rotti.webp" },
      { id: "ceylon_parotta",      name: "Ceylon Chicken Parotta",  price: 150, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Butter-Rotti.webp" },
      { id: "naan",                name: "Naan",                    price: 60,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Naan-450x450.webp" },
      { id: "butter_naan",         name: "Butter Naan",             price: 70,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Naan-450x450.webp" },
      { id: "rotti",               name: "Rotti",                   price: 40,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Rotti-450x450.webp" },
      { id: "butter_rotti",        name: "Butter Rotti",            price: 50,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Butter-Rotti.webp" },
      { id: "pulka_2pcs",          name: "Pulka (2pcs)",            price: 50,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/pulka-receipe-450x450.webp" },
      { id: "kulcha",              name: "Kulcha",                  price: 60,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Kulcha-450x450.webp" },
      { id: "butter_kulcha",       name: "Butter Kulcha",           price: 70,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Butter-Kulcha-450x450.webp" },
      { id: "garlic_naan",         name: "Garlic Naan",             price: 80,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Naan-450x450.webp" },
    ],
  },
  noodles: {
    label: "🍜 Noodles",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png",
    items: [
      { id: "veg_noodles",              name: "Veg Noodles",                   price: 120, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "egg_noodles",              name: "Egg Noodles",                   price: 140, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "chicken_noodles",          name: "Chicken Noodles",               price: 160, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "fish_noodles",             name: "Fish Noodles",                  price: 180, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "prawns_noodles",           name: "Prawns Noodles",                price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "mixed_noodles",            name: "Mixed Noodles",                 price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "schezwan_egg_noodles",     name: "Schezwan Egg Noodles",          price: 150, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "schezwan_chicken_noodles", name: "Schezwan Chicken Noodles",      price: 180, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "schezwan_fish_noodles",    name: "Schezwan Fish Noodles",         price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
    ],
  },
  fried_rice: {
    label: "🍚 Fried Rice",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png",
    items: [
      { id: "veg_fried_rice",              name: "Veg Fried Rice",                    price: 120, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "jeera_fried_rice",            name: "Jeera Fried Rice",                  price: 150, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "ghee_fried_rice",             name: "Ghee Fried Rice",                   price: 150, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "egg_fried_rice",              name: "Egg Fried Rice",                    price: 140, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "chicken_fried_rice",          name: "Chicken Fried Rice",                price: 160, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "prawns_fried_rice",           name: "Prawns Fried Rice",                 price: 200, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "schezwan_egg_fried_rice",     name: "Schezwan Egg Fried Rice",           price: 150, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "schezwan_chicken_fried_rice", name: "Schezwan Chicken Fried Rice",       price: 180, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "schezwan_prawns_fried_rice",  name: "Schezwan Prawns Fried Rice",        price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
      { id: "schezwan_mixed_fried_rice",   name: "Schezwan Mixed Meat Fried Rice",    price: 220, image: "https://kavirestaurant.in/wp-content/uploads/2026/04/download-10.png" },
    ],
  },
  tiffin: {
    label: "🥞 Tiffin",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Ghee-Roast.webp",
    items: [
      { id: "kal_dosa",              name: "Kal Dosa",                  price: 50,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Ghee-Roast.webp" },
      { id: "plain_dosa",            name: "Plain Dosa",                price: 50,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Ghee-Roast.webp" },
      { id: "ghee_roast",            name: "Ghee Roast",                price: 70,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Ghee-Roast.webp" },
      { id: "plain_roast",           name: "Plain Roast",               price: 60,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Ghee-Roast.webp" },
      { id: "uthappam",              name: "Uthappam",                  price: 50,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Ghee-Roast.webp" },
      { id: "onion_uthappam",        name: "Onion Uthappam",            price: 70,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Ghee-Roast.webp" },
      { id: "egg_dosai",             name: "Egg Dosai",                 price: 70,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Egg-Thosai-450x450.webp" },
      { id: "idly_2pcs",             name: "Idly (2pcs)",               price: 30,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Ghee-Roast.webp" },
      { id: "idiyappam_2pcs",        name: "Idiyappam (2pcs)",          price: 30,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Ghee-Roast.webp" },
      { id: "chicken_curry_uthappam",name: "Chicken Curry Uthappam",    price: 120, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Ghee-Roast.webp" },
    ],
  },
  meals: {
    label: "🍽️ Meals",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/04/Meals.png",
    items: [
      { id: "veg_meals",     name: "Veg Meals",     price: 120, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Veg-Meals-450x450.webp" },
      { id: "non_veg_meals", name: "Non Veg Meals", price: 140, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Non-Veg-Meals-450x450.webp" },
    ],
  },
  eggies: {
    label: "🥚 Eggies",
    image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Egg-Thosai-450x450.webp",
    items: [
      { id: "omelette",         name: "Omelette",         price: 25,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Egg-Thosai-450x450.webp" },
      { id: "double_omelette",  name: "Double Omelette",  price: 50,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Egg-Thosai-450x450.webp" },
      { id: "half_boil",        name: "Half Boil",        price: 20,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Egg-Thosai-450x450.webp" },
      { id: "full_boil",        name: "Full Boil",        price: 20,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Egg-Thosai-450x450.webp" },
      { id: "boiled_egg_2pcs",  name: "Boiled Egg 2pcs",  price: 40,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Egg-Thosai-450x450.webp" },
      { id: "masala_kalakki",   name: "Masala Kalakki",   price: 30,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Egg-Thosai-450x450.webp" },
      { id: "egg_burji",        name: "Egg Burji",        price: 70,  image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Egg-Thosai-450x450.webp" },
      { id: "egg_masala",       name: "Egg Masala",       price: 120, image: "https://kavirestaurant.in/wp-content/uploads/2026/05/Egg-Thosai-450x450.webp" },
    ],
  },
};

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function findItem(itemId) {
  for (const cat of Object.values(MENU)) {
    const item = cat.items.find((i) => i.id === itemId);
    if (item) return item;
  }
  return null;
}

function buildCartMsg(cart) {
  if (!cart || cart.length === 0) return "🛒 Your cart is empty!";
  let msg = "🛒 *Your Cart*\n─────────────────\n";
  cart.forEach((item, i) => {
    msg += `${i + 1}. ${item.name}\n   ${item.qty} × Rs.${item.price} = Rs.${item.price * item.qty}\n`;
  });
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  msg += `─────────────────\n💰 *Total: Rs.${grandTotal}*`;
  return msg;
}

function buildCartSummary(cart) {
  return cart.map((i) => `${i.name} x${i.qty}`).join(", ");
}

// ═══════════════════════════════════════════════════════════
// SEND FUNCTIONS
// ═══════════════════════════════════════════════════════════
async function sendMainMenu(to) {
  const rows = Object.entries(MENU).slice(0, 10).map(([key, cat]) => ({
    id: `CAT_${key}`,
    title: cat.label,
    description: `${cat.items.length} items`,
  }));
  const rows2 = Object.entries(MENU).slice(10).map(([key, cat]) => ({
    id: `CAT_${key}`,
    title: cat.label,
    description: `${cat.items.length} items`,
  }));

  const sections = [{ title: "🍽️ Menu Categories", rows }];
  if (rows2.length > 0) sections.push({ title: "More Categories", rows: rows2 });

  await sendList(
    to,
    "🍽️ Kavi Chettinadu Restaurant",
    "Authentic Chettinad flavours from Rameswaram! 🌶️\n\nSelect a category:",
    "Browse Menu",
    sections
  );
}

async function sendCategoryItems(to, catKey, page = 0) {
  const cat = MENU[catKey];
  if (!cat) return;

  const PAGE_SIZE = 9;
  const start = page * PAGE_SIZE;
  const pageItems = cat.items.slice(start, start + PAGE_SIZE);
  const hasMore = cat.items.length > start + PAGE_SIZE;

  const rows = pageItems.map((item) => ({
    id: `ITEM_${item.id}`,
    title: item.name,
    description: `Rs.${item.price}`,
  }));

  if (hasMore) rows.push({ id: `MORE_${catKey}_${page + 1}`, title: "➡️ More Items", description: "See more" });
  if (page > 0) rows.push({ id: `MORE_${catKey}_${page - 1}`, title: "⬅️ Previous", description: "Go back" });

  await sendList(
    to,
    cat.label,
    "Select an item to add to cart:",
    "Choose Item",
    [{ title: cat.label, rows }]
  );
}

async function sendQuantitySelect(to, item) {
  await sendButtons(
    to,
    `*${item.name}*\n💰 Price: Rs.${item.price}\n\nSelect quantity:`,
    [
      { id: `QTY_1___${item.id}`, title: "1️⃣  Qty: 1" },
      { id: `QTY_2___${item.id}`, title: "2️⃣  Qty: 2" },
      { id: `QTY_3___${item.id}`, title: "3️⃣  Qty: 3" },
    ]
  );
}

async function sendAfterAddToCart(to, cart) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  await sendButtons(
    to,
    `✅ *Item added to cart!*\n\n🛒 *Cart Total: Rs.${total}*\n\nWhat would you like to do?`,
    [
      { id: "ADD_MORE", title: "➕ Add More Items" },
      { id: "VIEW_CART", title: "🛒 View Cart" },
      { id: "PLACE_ORDER", title: "✅ Place Order" },
    ]
  );
}

async function sendPaymentMethod(to, total) {
  await sendButtons(
    to,
    `💰 *Total Amount: Rs.${total}*\n\nSelect payment method:`,
    [
      { id: "PAY_COD", title: "💵 Cash on Delivery" },
      { id: "PAY_UPI", title: "📲 UPI Payment" },
      { id: "PAY_CARD", title: "💳 Card Payment" },
    ]
  );
}

// ═══════════════════════════════════════════════════════════
// PLACE ORDER
// ═══════════════════════════════════════════════════════════
async function placeOrder(from, session) {
  const { name, phone, address, order_type, paymentMethod } = session.deliveryData;
  const total = session.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const orderId = "KAV" + Date.now();

  const orderTypeLabel =
    order_type === "delivery" ? "🚚 Home Delivery" :
    order_type === "takeaway" ? "🥡 Take Away" : "🍽️ Dine In";

  const payLabel =
    paymentMethod === "PAY_COD"  ? "💵 Cash on Delivery" :
    paymentMethod === "PAY_UPI"  ? "📲 UPI Payment" : "💳 Card Payment";

  // Include addon items
  const addonItems  = (session.deliveryData?.addons || []).map((a) => ({ name: a.name, price: a.price, quantity: 1 }));
  const addonTotal  = session.deliveryData?.addon_total || 0;
  const grandTotal  = total + addonTotal;
  const allItems    = [...session.cart.map((i) => ({ name: i.name, price: i.price, quantity: i.qty })), ...addonItems];

  // Time label
  const timeLabel = session.deliveryData?.delivery_time === "schedule" && session.deliveryData?.scheduled_time
    ? `📅 Scheduled: ${session.deliveryData.scheduled_time}`
    : "⚡ ASAP (30-45 mins)";

  const newOrder = new Order({
    orderId,
    phone: phone || from,
    name:  name  || "Customer",
    address: address || orderTypeLabel,
    items: allItems,
    totalAmount: grandTotal,
    paymentMethod: payLabel,
    status: "confirmed",
  });
  await newOrder.save();
  console.log(`✅ Order: ${orderId} | Total: Rs.${total}`);

  session.cart = [];
  session.deliveryData = {};
  session.deliveryStep = null;
  session.state = "WELCOME";
  session.markModified("cart");
  session.markModified("deliveryData");
  await session.save();

  const itemsList = newOrder.items
    .map((i) => `• ${i.name} × ${i.quantity} = Rs.${i.price * i.quantity}`)
    .join("\n");

  await sendButtons(
    from,
    `🎉 *Order Placed Successfully!*\n\n` +
    `📋 *Order ID:* #${orderId}\n` +
    `─────────────────\n` +
    `*Items:*\n${itemsList}\n` +
    `─────────────────\n` +
    `💰 *Total: Rs.${grandTotal}*\n` +
    `💳 *Payment:* ${payLabel}\n` +
    `🚚 *Type:* ${orderTypeLabel}\n` +
    `🏠 *Address:* ${address || orderTypeLabel}\n` +
    `─────────────────\n` +
    `⏱️ *Estimated Time:* 30-45 mins\n\n` +
    `Thank you for ordering from\n🍛 *Kavi Chettinadu Restaurant!* 🙏\n📞 95859 60612`,
    [
      { id: "BROWSE_MENU", title: "🔄 Order Again" },
      { id: "exit", title: "❌ Exit" },
    ]
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════
const handleMessage = async (from, messageBody, interactiveReply, locationData, catalogueOrder) => {
  try {
    let session = await Session.findOne({ phoneNumber: from });
    if (!session) {
      session = new Session({ phoneNumber: from, state: "WELCOME", cart: [] });
      await session.save();
    }
    if (!session.cart) session.cart = [];
    if (!session.deliveryData) session.deliveryData = {};
    session.lastActivity = new Date();

    const input    = interactiveReply?.id || messageBody?.trim()?.toLowerCase();
    const rawInput = messageBody?.trim();

    console.log(`📥 From: ${from} | Input: ${input} | State: ${session.state}`);

    // ── EXIT ──────────────────────────────────────────────
    if (["exit", "bye", "quit"].includes(input)) {
      session.state = "WELCOME"; session.cart = []; session.deliveryData = {}; session.deliveryStep = null;
      session.markModified("cart"); session.markModified("deliveryData");
      await session.save();
      await sendText(from, "👋 *Thank you for visiting Kavi Chettinadu Restaurant!*\n\nSend *hi* anytime to order again. 🍛");
      return;
    }

    // ── GREETING ──────────────────────────────────────────
    if (["hi", "hello", "hey", "start", "menu"].includes(input)) {
      session.state = "MAIN_MENU"; session.cart = []; session.deliveryData = {}; session.deliveryStep = null;
      session.markModified("cart"); session.markModified("deliveryData");
      await session.save();
      await sendButtons(
        from,
        `👋 *Welcome to Kavi Chettinadu Restaurant!* 🍛\n\n_Taste The Tradition_ ✨\n\n📍 14/12A1, Kattupillaiyar Kovil Street\nRameswaram - 623526\n\n⏰ Open: 12:00 PM – 10:30 PM\n📞 95859 60612\n\nWould you like to browse our menu?`,
        [
          { id: "BROWSE_MENU", title: "✅ Yes, Show Menu" },
          { id: "exit",        title: "❌ No, Exit" },
        ]
      );
      return;
    }

    // ── BROWSE MENU ───────────────────────────────────────
    if (["BROWSE_MENU", "ADD_MORE", "MAIN_MENU"].includes(input)) {
      session.state = "CATEGORY_SELECT";
      await session.save();
      await sendMainMenu(from);
      return;
    }

    // ── CATEGORY SELECT ───────────────────────────────────
    if (input?.startsWith("CAT_")) {
      const catKey = input.replace("CAT_", "");
      session.currentCategory = catKey;
      session.state = "ITEM_SELECT";
      await session.save();
      await sendCategoryItems(from, catKey, 0);
      return;
    }

    // ── PAGINATION ────────────────────────────────────────
    if (input?.startsWith("MORE_")) {
      const parts   = input.split("_");
      const page    = parseInt(parts[parts.length - 1]);
      const catKey  = parts.slice(1, parts.length - 1).join("_");
      session.currentCategory = catKey;
      await session.save();
      await sendCategoryItems(from, catKey, page);
      return;
    }

    // ── ITEM SELECT ───────────────────────────────────────
    if (input?.startsWith("ITEM_")) {
      const itemId = input.replace("ITEM_", "");
      const item   = findItem(itemId);
      if (!item) { await sendText(from, "❌ Item not found. Please try again."); return; }
      session.pendingItem = { id: item.id, name: item.name, price: item.price };
      session.state = "QUANTITY_SELECT";
      session.markModified("pendingItem");
      await session.save();
      await sendQuantitySelect(from, item);
      return;
    }

    // ── QUANTITY SELECT ───────────────────────────────────
    if (input?.startsWith("QTY_")) {
      const withoutPrefix = input.replace("QTY_", "");
      const sepIdx = withoutPrefix.indexOf("___");
      const qty    = parseInt(withoutPrefix.substring(0, sepIdx));
      const itemId = withoutPrefix.substring(sepIdx + 3);
      const item   = findItem(itemId) || session.pendingItem;
      if (!item) { await sendText(from, "❌ Error. Please try again."); return; }

      const existing = session.cart.findIndex((c) => c.itemId === item.id);
      if (existing >= 0) { session.cart[existing].qty += qty; }
      else { session.cart.push({ itemId: item.id, name: item.name, price: item.price, qty }); }
      session.pendingItem = null;
      session.state = "CART";
      session.markModified("cart");
      await session.save();
      await sendAfterAddToCart(from, session.cart);
      return;
    }

    // ── VIEW CART ─────────────────────────────────────────
    if (input === "VIEW_CART") {
      const cartMsg = buildCartMsg(session.cart);
      if (!session.cart || session.cart.length === 0) {
        await sendButtons(from, cartMsg, [{ id: "BROWSE_MENU", title: "🍴 Browse Menu" }, { id: "exit", title: "❌ Exit" }]);
      } else {
        await sendButtons(from, cartMsg, [
          { id: "ADD_MORE",    title: "➕ Add More"    },
          { id: "PLACE_ORDER", title: "✅ Place Order" },
          { id: "CLEAR_CART",  title: "🗑️ Clear Cart" },
        ]);
      }
      return;
    }

    // ── CLEAR CART ────────────────────────────────────────
    if (input === "CLEAR_CART") {
      session.cart = [];
      session.markModified("cart");
      await session.save();
      await sendButtons(from, "🗑️ Cart cleared!", [{ id: "BROWSE_MENU", title: "🍴 Browse Menu" }, { id: "exit", title: "❌ Exit" }]);
      return;
    }

    // ── PLACE ORDER → WhatsApp Flow Popup ────────────────
    if (["PLACE_ORDER", "PLACE_ORDER_FLOW"].includes(input)) {
      if (!session.cart || session.cart.length === 0) {
        await sendButtons(from, "❌ Your cart is empty!", [{ id: "BROWSE_MENU", title: "🍴 Browse Menu" }]);
        return;
      }
      session.state = "AWAITING_FLOW";
      await session.save();
      const cartSummary = buildCartSummary(session.cart);
      const total       = session.cart.reduce((s, i) => s + i.price * i.qty, 0);
      await sendDeliveryFlow(from, cartSummary, total);
      return;
    }

    // ── PAYMENT ───────────────────────────────────────────
    if (["PAY_COD", "PAY_UPI", "PAY_CARD"].includes(input)) {
      session.deliveryData.paymentMethod = input;
      session.markModified("deliveryData");
      await session.save();

      if (input === "PAY_UPI") {
        const total = session.cart.reduce((s, i) => s + i.price * i.qty, 0);
        const upiId = process.env.RESTAURANT_UPI_ID || "kaviyakiruthi22@okhdfcbank";
        await sendText(from, `📲 *UPI Payment Details*\n\n💳 UPI ID: *${upiId}*\n💰 Amount: *Rs.${total}*\n\nPlease complete the payment and confirm below.`);
        await sendButtons(from, "Have you completed the UPI payment?", [
          { id: "UPI_DONE", title: "✅ Payment Done" },
          { id: "PAY_COD",  title: "💵 Pay COD instead" },
        ]);
        return;
      }
      if (input === "PAY_CARD") {
        await sendText(from, "💳 *Card payment will be collected at delivery/counter.*");
      }
      await placeOrder(from, session);
      return;
    }

    // ── UPI DONE ──────────────────────────────────────────
    if (input === "UPI_DONE") {
      session.deliveryData.paymentMethod = "PAY_UPI";
      session.markModified("deliveryData");
      await session.save();
      await placeOrder(from, session);
      return;
    }

    // ── FALLBACK ──────────────────────────────────────────
    await sendButtons(
      from,
      `🤔 I didn't understand that.\n\nSend *hi* to start ordering! 🍛`,
      [
        { id: "hi",       title: "🍴 Start Ordering" },
        { id: "VIEW_CART",title: "🛒 View Cart"       },
        { id: "exit",     title: "❌ Exit"             },
      ]
    );

  } catch (err) {
    console.error("❌ handleMessage Error:", err.message);
    if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  }
};

module.exports = { handleMessage, placeOrder };