{
  class Error {
    constructor(message, data) {
      this.message = message;
      this.data = data;
    }
  }

  class Group {
    constructor(title, products) {
      this.title = title;
      this.products = products || [];
    }
  }

  //TODO: Add productUrl to Product class
  class Product {
    constructor(
      name,
      imageUrl,
      description,
      productUrl,
      price,
      merchant,
      template
    ) {
      this.validateArgs([name, imageUrl, productUrl, merchant]);
      this.name = name;
      this.imageUrl = imageUrl;
      this.description = description;
      this.merchant = merchant;
      this.productUrl = productUrl;
      this.price = price;
      this.template = (template || "standard").toLowerCase();
    }

    validateArgs(args) {
      if (!args || args.some((arg) => !arg))
        throw new Error("Product data is invalid", args);
    }
  }

  class Merchant {
    constructor(name, price, productUrl) {
      this.name = name;
      this.price = price;
      this.productUrl = productUrl;
    }
  }

  function OnRenderAffiliateDevice(data) {
    if (!data || !data.Fragments)
      throw new Error(
        "Supplied data is missing required info to render products",
        data
      );

    const groups = Object.keys(data.Fragments).reduce((result, key) => {
      if (!data.Fragments[key].Slices) return result;

      const groups = data.Fragments[key].Slices.map((slice) => GetGroup(slice));
      result.push(...groups);
      return result;
    }, []);

    if (!AreGroupsValid(groups))
      throw new Error("Group/Product data is either invalid or incomplete", {
        Input: data,
        Groups: groups,
      });

    groups.forEach((group) => RenderGroup(group));
  }

  function GetGroup(slice) {
    if(!slice) return;
    const products = slice._repeat.GroupDocs.map((groupDoc) =>
      GetProduct(groupDoc)
    );

    let title =
      slice._nonRepeat &&
      slice._nonRepeat.Fragments &&
      slice._nonRepeat.Fragments.group_title &&
      slice._nonRepeat.Fragments.group_title.Value;

    return new Group(title, products);
  }

  function GetProduct(doc) {
    if (!(doc && doc.Fragments && doc.Fragments.product && doc.Fragments.product.Fragments)) return null;

    const productFragment = doc.Fragments.product.Fragments;

    const merchant = GetMerchant(
      productFragment["affiliate_product.merchants"]
    );
    if (!merchant) throw new Error("Merchant details are missing", doc);

    return new Product(
      getPropValue(productFragment, "affiliate_product.name").Value,
      getPropValue(doc.Fragments, "product_image_url").Value,
      getProductDescription(productFragment, "affiliate_product.description"),
      //merchant.productUrl,
      getPropValue(doc.Fragments, "product_url").Value,
      merchant.price,
      merchant.name,
      getPropValue(doc.Fragments, "template").Value
    );
  }


  function GetMerchant(merchants) {
    if (!merchants || !Array.isArray(merchants.GroupDocs) || merchants.GroupDocs.length <= 0) return null;
    const merchantDetails = merchants.GroupDocs[0].Fragments;
    if (!merchantDetails) return null;

    const regx = new RegExp(".*_price$", "i");
    const properties = Object.keys(merchantDetails).filter((prop) =>
      regx.test(prop)
    );

    return new Merchant(
      getPropValue(merchantDetails, "merchant").Value,
      getLowestPrice(
        properties.map((prop) => merchantDetails[prop] && merchantDetails[prop].Value)
      ),
      getPropValue(merchantDetails, "product_root_url").Value
    );
  }

  //It's fine if group title is missing
  function AreGroupsValid(groups) {
    return groups.every((group) => !!group.products);
  }

  function RenderGroup(group) {
    if (!group) return;
    const templates = {
      standard: "standardAdunitTemplate",
      editorial: "editorialAdunitTemplate",
    };

    const mainTemplate = $("script#affiliateGroupTemplate");
    const main = mainTemplate.render(group);
    group.products.forEach((product) => {
      const productTemplate = $(`script#${templates[product.template]}`);
      //Object.assign(product, {product: JSON.stringify(product)});
      main.find(".adunitContainer").append(productTemplate.render(product));
    });
    //$("body").append(main);
    $("#productContainer").append(main);
  }

  function navigateToAffiliateProduct(event, productUrl, product, affiliate) {
    event.preventDefault();
    if (window.Notifications)
      window.Notifications.Notify("on-affiliate-product-click", undefined, {
        product,
        affiliate,
      });
    window.open(productUrl, "_blank");
  }

  function getPropValue(obj, prop) {
    if(!obj) return {};
    return obj[prop] || {};
  }

  function getProductDescription(obj, prop) {
    const descProp = getPropValue(obj, prop);
    if(!descProp.Blocks || !Array.isArray(descProp.Blocks)  || descProp.Blocks.length <= 0) return null;
    return (descProp.Blocks[0] || {}).Text;
  }

  function formatAsCurrency(val) {
    if (!val) return "";
    return `$${val.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`;
  }

  function getLowestPrice(arr) {
    return Math.min(...arr.filter((x) => x > 0));
  }
}

let data = {
  Id: "Yk-pQRIAACIAi58E",
  Uid: null,
  Href: "https://affiliatemanager.cdn.prismic.io/api/v1/documents/search?ref=Yl16jRIAAK4iyPeL&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22Yk-pQRIAACIAi58E%22%29+%5D%5D",
  Tags: ["Email Send"],
  Slugs: ["2022314auhd"],
  Slug: "2022314auhd",
  Type: "pch_deals",
  Lang: "en-us",
  AlternateLanguages: [],
  FirstPublicationDate: "2022-04-07T23:19:35-04:00",
  LastPublicationDate: "2022-04-18T10:49:49-04:00",
  Fragments: {
    "pch_deals.experience_id": {
      Value: "2022314AUHD",
    },
    "pch_deals.body": {
      Slices: [
        {
          SliceType: "pch_deal_group",
          SliceLabel: null,
          Items: null,
          _repeat: {
            GroupDocs: [
              {
                Fragments: {
                  product: {
                    Id: "Yk9LahIAACIAif6n",
                    Uid: null,
                    Type: "affiliate_product",
                    Tags: [],
                    Slug: "farnam-rain-maker-triple-action-hoof-moisturizer-and-conditioner",
                    IsBroken: false,
                    Lang: "en-us",
                    Fragments: {
                      "affiliate_product.merchants": {
                        GroupDocs: [
                          {
                            Fragments: {
                              merchant: {
                                Value: "Amazon",
                              },
                              merchant_list_price: {
                                Value: 31.49,
                              },
                              product_root_url: {
                                Value:
                                  "https://www.amazon.com/Farnam-Triple-Action-Moisturizer-Conditioner/dp/B000HHSFTE",
                              },
                            },
                          },
                        ],
                      },
                      "affiliate_product.name": {
                        Value:
                          "Farnam Rain Maker Triple Action Hoof Moisturizer and Conditioner",
                      },
                      "affiliate_product.description": {
                        Blocks: [
                          {
                            Text: "Rain Maker Hoof Moisturizer and Conditioner leaves hoofs with a healthy balance of moisture. It’s an advanced hoof dressing that helps restore and condition damaged hoofs, so they can absorb the stresses and shocks of daily life with ease. The triple action formula of Rain Maker Hoof Moisturizer and Conditioner leaves your horse with hoofs that attract, absorb and retain moisture.",
                            Spans: [],
                            Label: null,
                          },
                        ],
                      },
                      "affiliate_product.image_url": {
                        Value:
                          "https://images.wideopenpets.com/wp-content/uploads/2022/04/rainmaker.jpg",
                      },
                    },
                  },
                  product_url: {
                    Value:
                      "https://www.amazon.com/Farnam-Triple-Action-Moisturizer-Conditioner/dp/B000HHSFTE",
                  },
                  product_image_url: {
                    Value:
                      "https://images.wideopenpets.com/wp-content/uploads/2022/04/rainmaker.jpg",
                  },
                  template: {
                    Value: "Standard",
                  },
                },
              },
              {
                Fragments: {
                  product: {
                    Id: "Yk9KJRIAAK4iifjb",
                    Uid: null,
                    Type: "affiliate_product",
                    Tags: [],
                    Slug: "loperdeve-7-bird-mirror-with-rope-perch",
                    IsBroken: false,
                    Lang: "en-us",
                    Fragments: {
                      "affiliate_product.merchants": {
                        GroupDocs: [
                          {
                            Fragments: {
                              merchant: {
                                Value: "Amazon",
                              },
                              merchant_sale_price: {
                                Value: 12.99,
                              },
                              product_root_url: {
                                Value:
                                  "https://www.amazon.com/LOPERDEVE-Parakeet-Cockatiel-Lovebirds-Canaries/dp/B08XNPF86G",
                              },
                            },
                          },
                        ],
                      },
                      "affiliate_product.name": {
                        Value: 'Loperdeve 7" Bird Mirror with Rope Perch',
                      },
                      "affiliate_product.description": {
                        Blocks: [
                          {
                            Text: "This is a comfortable perch for a parakeet to view themselves, and the cotton rope is fun for them to chew. ",
                            Spans: [],
                            Label: null,
                          },
                        ],
                      },
                      "affiliate_product.image_url": {
                        Value:
                          "https://images.wideopenpets.com/wp-content/uploads/2022/04/ropeperch.jpg",
                      },
                    },
                  },
                  product_url: {
                    Value:
                      "https://www.amazon.com/LOPERDEVE-Parakeet-Cockatiel-Lovebirds-Canaries/dp/B08XNPF86G",
                  },
                  product_image_url: {
                    Value:
                      "https://images.wideopenpets.com/wp-content/uploads/2022/04/ropeperch.jpg",
                  },
                  template: {
                    Value: "Editorial",
                  },
                },
              },
              {
                Fragments: {
                  product: {
                    Id: "Yk9JdhIAAK4iifXF",
                    Uid: null,
                    Type: "affiliate_product",
                    Tags: [],
                    Slug: "kaytee-forti-diet-pro-health-parakeet-food",
                    IsBroken: false,
                    Lang: "en-us",
                    Fragments: {
                      "affiliate_product.merchants": {
                        GroupDocs: [
                          {
                            Fragments: {
                              merchant: {
                                Value: "Amazon",
                              },
                              merchant_list_price: {
                                Value: 6.1,
                              },
                              product_root_url: {
                                Value:
                                  "https://www.amazon.com/Kaytee-Forti-Diet-Health-Bird-Parakeets/dp/B013GLHV1K",
                              },
                            },
                          },
                        ],
                      },
                      "affiliate_product.name": {
                        Value: "Kaytee Forti-Diet Pro Health Parakeet Food",
                      },
                      "affiliate_product.description": {
                        Blocks: [
                          {
                            Text: "This vet-recommended brain also promotes heart, brain, and eye health for your bird. ",
                            Spans: [],
                            Label: null,
                          },
                        ],
                      },
                      "affiliate_product.image_url": {
                        Value:
                          "https://images.wideopenpets.com/wp-content/uploads/2022/04/kayteefortidiet.jpg",
                      },
                    },
                  },
                  product_url: {
                    Value:
                      "https://www.amazon.com/LOPERDEVE-Parakeet-Cockatiel-Lovebirds-Canaries/dp/B08XNPF86G",
                  },
                  product_image_url: {
                    Value:
                      "https://images.wideopenpets.com/wp-content/uploads/2022/04/ropeperch.jpg",
                  },
                  template: {
                    Value: "Standard",
                  },
                },
              },
              {
                Fragments: {
                  product: {
                    Id: "Yk9I8BIAAB8AifNe",
                    Uid: null,
                    Type: "affiliate_product",
                    Tags: [],
                    Slug: "kaytee-treat-stick---honey-flavor",
                    IsBroken: false,
                    Lang: "en-us",
                    Fragments: {
                      "affiliate_product.merchants": {
                        GroupDocs: [
                          {
                            Fragments: {
                              merchant: {
                                Value: "Amazon",
                              },
                              merchant_list_price: {
                                Value: 3.96,
                              },
                              product_root_url: {
                                Value:
                                  "https://www.amazon.com/Kaytee-Treat-Stick-Honey-Flavor/dp/B007QHBI60",
                              },
                            },
                          },
                        ],
                      },
                      "affiliate_product.name": {
                        Value: "Kaytee Treat Stick - Honey Flavor",
                      },
                      "affiliate_product.image_url": {
                        Value:
                          "https://images.wideopenpets.com/wp-content/uploads/2022/04/kayteetreatstick.jpg",
                      },
                      "affiliate_product.description": {
                        Blocks: [
                          {
                            Text: "Increases stimulation and made of fine grains — perfect for your parakeet. ",
                            Spans: [],
                            Label: null,
                          },
                        ],
                      },
                    },
                  },
                  product_url: {
                    Value:
                      "https://www.amazon.com/LOPERDEVE-Parakeet-Cockatiel-Lovebirds-Canaries/dp/B08XNPF86G",
                  },
                  product_image_url: {
                    Value:
                      "https://images.wideopenpets.com/wp-content/uploads/2022/04/ropeperch.jpg",
                  },
                  template: {
                    Value: "Standard",
                  },
                },
              },
            ],
          },
          _nonRepeat: {
            Fragments: {
              group_title: {
                Value: "Group 1 (Our Pet Picks)",
              },
            },
          },
        },
        {
          SliceType: "pch_deal_group",
          SliceLabel: null,
          Items: null,
          _repeat: {
            GroupDocs: [
              {
                Fragments: {
                  product: {
                    Id: "Yk9HdRIAAJQcieyw",
                    Uid: null,
                    Type: "affiliate_product",
                    Tags: [],
                    Slug: "equus-magnificus-german-horse-muffin",
                    IsBroken: false,
                    Lang: "en-us",
                    Fragments: {
                      "affiliate_product.merchants": {
                        GroupDocs: [
                          {
                            Fragments: {
                              merchant: {
                                Value: "Chewy",
                              },
                              merchant_list1_price: {
                                Value: 67.32,
                              },
                              merchant_list2_price: {
                                Value: 27.32,
                              },
                              merchant_list3_price: {
                                Value: null,
                              },
                              merchant_list4_price: {
                                Value: "free",
                              },
                              product_root_url: {
                                Value:
                                  "https://www.chewy.com/equus-magnificus-german-horse-muffin/dp/226452",
                              },
                            },
                          },
                        ],
                      },
                      "affiliate_product.name": {
                        Value: "Equus Magnificus German Horse Muffin",
                      },
                      "affiliate_product.description": {
                        Blocks: [
                          {
                            Text: "Natural ingredients and fortified with vitamins so you can feel good about how you’re feeding your equine partner. Soft and chewy for easy eating — and ideal for giving medicines.",
                            Spans: [],
                            Label: null,
                          },
                        ],
                      },
                      "affiliate_product.image_url": {
                        Value:
                          "https://images.wideopenpets.com/wp-content/uploads/2022/04/horsemuffin.jpg",
                      },
                    },
                  },
                  product_url: {
                    Value:
                      "https://www.amazon.com/LOPERDEVE-Parakeet-Cockatiel-Lovebirds-Canaries/dp/B08XNPF86G",
                  },
                  product_image_url: {
                    Value:
                      "https://images.wideopenpets.com/wp-content/uploads/2022/04/ropeperch.jpg",
                  },
                  template: {
                    Value: "Standard",
                  },
                },
              },
              {
                Fragments: {
                  product: {
                    Id: "Yk9GwhIAACIAiemQ",
                    Uid: null,
                    Type: "affiliate_product",
                    Tags: [],
                    Slug: "zoo-med-betta-leaf-hammock",
                    IsBroken: false,
                    Lang: "en-us",
                    Fragments: {
                      "affiliate_product.merchants": {
                        GroupDocs: [
                          {
                            Fragments: {
                              merchant: {
                                Value: "Chewy",
                              },
                              merchant_list_price: {
                                Value: 2.51,
                              },
                              merchant_discount_price: {
                                Value: 20.51,
                              },
                              product_root_url: {
                                Value:
                                  "https://www.chewy.com/zoo-med-betta-bed-leaf-hammock/dp/154814",
                              },
                            },
                          },
                        ],
                      },
                      "affiliate_product.name": {
                        Value: "Zoo Med Betta Leaf Hammock",
                      },
                      "affiliate_product.description": {
                        Blocks: [
                          {
                            Text: "This hammock sticks to the side of your betta fish tank so your fish can relax and lay.",
                            Spans: [],
                            Label: null,
                          },
                        ],
                      },
                      "affiliate_product.image_url": {
                        Value:
                          "https://images.wideopenpets.com/wp-content/uploads/2022/04/bettaleaf.jpg",
                      },
                    },
                  },
                  product_url: {
                    Value:
                      "https://www.amazon.com/LOPERDEVE-Parakeet-Cockatiel-Lovebirds-Canaries/dp/B08XNPF86G",
                  },
                  product_image_url: {
                    Value:
                      "https://images.wideopenpets.com/wp-content/uploads/2022/04/ropeperch.jpg",
                  },
                  template: {
                    Value: "Standard",
                  },
                },
              },
              {
                Fragments: {
                  product: {
                    Id: "Yk9GAxIAAK4iieZB",
                    Uid: null,
                    Type: "affiliate_product",
                    Tags: [],
                    Slug: "american-journey-turkey--chicken-recipe-grain-free-dry-cat-food",
                    IsBroken: false,
                    Lang: "en-us",
                    Fragments: {
                      "affiliate_product.merchants": {
                        GroupDocs: [
                          {
                            Fragments: {
                              merchant: {
                                Value: "Chewy",
                              },
                              merchant_list_price: {
                                Value: 31.99,
                              },
                              merchant_discount_price: {
                                Value: 0.99,
                              },
                              product_root_url: {
                                Value:
                                  "https://www.chewy.com/american-journey-turkey-chicken/dp/158630",
                              },
                            },
                          },
                        ],
                      },
                      "affiliate_product.name": {
                        Value:
                          "American Journey Turkey & Chicken Recipe Grain-Free Dry Cat Food",
                      },
                      "affiliate_product.description": {
                        Blocks: [
                          {
                            Text: "Made without grains, this kibble features real, deboned turkey as the first ingredient, wholesome fruits and vegetables, and deboned chicken. It’s carefully crafted in the USA with ingredients from around the world, and no poultry by-product meal, corn, wheat, soy or artificial preservatives. This delicious recipe delivers 40% protein, plus powerful nutrients and essential amino acids.",
                            Spans: [],
                            Label: null,
                          },
                        ],
                      },
                      "affiliate_product.image_url": {
                        Value:
                          "https://images.wideopenpets.com/wp-content/uploads/2022/04/131581_MAIN._AC_SL1500_V1514493200_.jpg",
                      },
                    },
                  },
                  product_url: {
                    Value:
                      "https://www.amazon.com/LOPERDEVE-Parakeet-Cockatiel-Lovebirds-Canaries/dp/B08XNPF86G",
                  },
                  product_image_url: {
                    Value:
                      "https://images.wideopenpets.com/wp-content/uploads/2022/04/ropeperch.jpg",
                  },
                  template: {
                    Value: "Standard",
                  },
                },
              },
            ],
          },
          _nonRepeat: {
            Fragments: {
              group_title: {
                Value: "Group 2 (Even MORE of Our Pet Picks)",
              },
            },
          },
        },
      ],
    },
  },
};
