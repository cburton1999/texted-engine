const templateGame = {
  "Items": [
    {
      "Id": "old_key",
      "Name": "Rusty Key",
      "Description": "An old rusty key with ornate designs. It looks like it belongs to something important."
    },
    {
      "Id": "diary",
      "Name": "Tattered Diary",
      "Description": "A weathered diary belonging to Elizabeth Blackwood. Many pages are missing."
    },
    {
      "Id": "locket",
      "Name": "Silver Locket",
      "Description": "A tarnished silver locket containing a small portrait of a young woman."
    },
    {
      "Id": "salt",
      "Name": "Blessed Salt",
      "Description": "A pouch of salt blessed by a priest. It could ward off evil spirits."
    },
    {
      "Id": "candle",
      "Name": "Black Candle",
      "Description": "An unlit black candle with strange symbols carved into its surface."
    },
    {
      "Id": "matches",
      "Name": "Matches",
      "Description": "A small box of matches. Most of them are still usable."
    },
    {
      "Id": "ritual_book",
      "Name": "Book of Rituals",
      "Description": "An ancient book detailing various spiritual cleansing rituals."
    }
  ],
  "Maps": [
    {
      "Name": "Blackwood Manor",
      "Description": "A decrepit Victorian mansion with a dark history",
      "Introduction": "You stand before Blackwood Manor, an imposing Victorian mansion that has been abandoned for decades. Local legends speak of Elizabeth Blackwood, a young woman who died under mysterious circumstances in 1892. Her restless spirit is said to still haunt these halls, growing more violent with each passing year. You've come to find her remains and perform a ritual to finally give her peace.\n\nA cold wind whips around you as you approach the entrance. The ghost's presence grows stronger - you must hurry before she finds you.",
      "Locations": [
        {
          "Name": "Front Porch",
          "Description": "The wooden porch creaks beneath your feet. Dead leaves scatter across the weathered boards.",
          "Items": [],
          "FoculPoints": [
            {
              "Name": "Front Door",
              "Description": "A heavy oak door with tarnished brass fittings. It's locked tight.",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "The door is locked. You'll need to find a key."
                      ]
                    }
                  ]
                },
                {
                  "Event": 3,
                  "ItemId": "old_key",
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "The key fits! With a heavy groan, the door swings open."
                      ]
                    },
                    {
                      "Event": 3,
                      "Arguments": [
                        "1"
                      ]
                    }
                  ]
                }
              ],
              "Flags": []
            },
            {
              "Name": "Welcome Mat",
              "Description": "A faded welcome mat, partially hidden under years of debris.",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "You lift the mat and find a rusty key hidden underneath!"
                      ]
                    },
                    {
                      "Event": 1,
                      "Arguments": [
                        "old_key"
                      ]
                    }
                  ]
                }
              ],
              "Flags": [],
              "Aliases": [
                {
                  "Verb": "lift",
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "You bend down to lift the mat..."
                      ]
                    },
                    {
                      "Event": 1,
                      "Arguments": [
                        "old_key"
                      ]
                    }
                  ]
                },
                {
                  "Verb": "move",
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "You move the mat aside..."
                      ]
                    },
                    {
                      "Event": 1,
                      "Arguments": [
                        "old_key"
                      ]
                    }
                  ]
                },
                {
                  "Verb": "kick",
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "You give the mat a swift kick, disturbing years of dust..."
                      ]
                    },
                    {
                      "Event": 1,
                      "Arguments": [
                        "old_key"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "Name": "Ghost Manifestation",
              "Description": "A cold spot forms in the air, and a translucent figure begins to materialize!",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "The ghost of Elizabeth appears! Her face contorts in anger as she lunges toward you! You barely dodge out of the way as she passes through the spot where you were standing."
                      ]
                    }
                  ]
                }
              ],
              "Flags": []
            }
          ]
        },
        {
          "Name": "Foyer",
          "Description": "Moonlight filters through broken windows, illuminating the dusty foyer. A grand staircase leads upstairs, and doorways branch off to other rooms.",
          "Items": [],
          "FoculPoints": [
            {
              "Name": "Staircase",
              "Description": "The once-grand staircase is now worn and dangerous-looking.",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "You carefully ascend the creaking stairs."
                      ]
                    },
                    {
                      "Event": 3,
                      "Arguments": [
                        "2"
                      ]
                    }
                  ]
                }
              ],
              "Flags": []
            },
            {
              "Name": "Side Table",
              "Description": "A small table against the wall holds a candlestick and some old papers.",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "Among the papers, you find a box of matches."
                      ]
                    },
                    {
                      "Event": 1,
                      "Arguments": [
                        "matches"
                      ]
                    }
                  ]
                }
              ],
              "Flags": []
            },
            {
              "Name": "Study Door",
              "Description": "A door leading to what appears to be a study.",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "You enter the study."
                      ]
                    },
                    {
                      "Event": 3,
                      "Arguments": [
                        "3"
                      ]
                    }
                  ]
                }
              ],
              "Flags": []
            }
          ]
        },
        {
          "Name": "Upper Hall",
          "Description": "The upper hallway stretches into darkness. Old portraits line the walls, their eyes seeming to follow your movement.",
          "Items": [],
          "FoculPoints": [
            {
              "Name": "Master Bedroom Door",
              "Description": "The door to the master bedroom stands slightly ajar.",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "You push open the door and enter the master bedroom."
                      ]
                    },
                    {
                      "Event": 3,
                      "Arguments": [
                        "4"
                      ]
                    }
                  ]
                }
              ],
              "Flags": []
            },
            {
              "Name": "Portrait",
              "Description": "A portrait of a young woman in Victorian dress - Elizabeth Blackwood herself.",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "You notice she's wearing a silver locket identical to the one you found. In the portrait, she's standing in front of a fireplace in the study."
                      ]
                    }
                  ]
                }
              ],
              "Flags": []
            }
          ]
        },
        {
          "Name": "Study",
          "Description": "Book-lined walls surround a massive desk. A cold fireplace dominates one wall.",
          "Items": [],
          "FoculPoints": [
            {
              "Name": "Desk",
              "Description": "A large mahogany desk covered in old papers and books.",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "Among the papers, you find Elizabeth's diary and an old book of rituals!"
                      ]
                    },
                    {
                      "Event": 1,
                      "Arguments": [
                        "diary"
                      ]
                    },
                    {
                      "Event": 1,
                      "Arguments": [
                        "ritual_book"
                      ]
                    }
                  ]
                }
              ],
              "Flags": []
            },
            {
              "Name": "Fireplace",
              "Description": "A grand fireplace with intricate carvings. Something glints in the ashes.",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "Digging through the cold ashes, you find a tarnished silver locket!"
                      ]
                    },
                    {
                      "Event": 1,
                      "Arguments": [
                        "locket"
                      ]
                    }
                  ]
                }
              ],
              "Flags": []
            }
          ]
        },
        {
          "Name": "Master Bedroom",
          "Description": "A large four-poster bed dominates the room. The air is thick with supernatural energy.",
          "Items": [],
          "FoculPoints": [
            {
              "Name": "Bedside Table",
              "Description": "A small table beside the bed holds various items.",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "You find a black candle with strange markings."
                      ]
                    },
                    {
                      "Event": 1,
                      "Arguments": [
                        "candle"
                      ]
                    }
                  ]
                }
              ],
              "Flags": []
            },
            {
              "Name": "Closet",
              "Description": "A large wardrobe closet with a false back panel.",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "Behind the panel, you find a pouch of blessed salt!"
                      ]
                    },
                    {
                      "Event": 1,
                      "Arguments": [
                        "salt"
                      ]
                    }
                  ]
                }
              ],
              "Flags": []
            },
            {
              "Name": "Elizabeth's Remains",
              "Description": "A loose floorboard reveals a hidden space beneath - containing human remains!",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "These must be Elizabeth's remains, hidden here after her murder. You'll need the proper items to perform the cleansing ritual."
                      ]
                    }
                  ]
                },
                {
                  "Event": 3,
                  "ItemId": "ritual_book",
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "The ritual book describes the cleansing ceremony: You'll need a black candle, matches to light it, blessed salt to form a circle, and a personal object of the deceased."
                      ]
                    }
                  ]
                },
                {
                  "Event": 3,
                  "ItemId": "candle",
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "You place the black candle near the remains. You'll need to light it for the ritual."
                      ]
                    },
                    {
                      "Event": 4,
                      "Arguments": [
                        "candle_placed",
                        "true"
                      ]
                    }
                  ]
                },
                {
                  "Event": 3,
                  "ItemId": "matches",
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "You light the black candle. Its flame burns with an eerie blue light."
                      ]
                    },
                    {
                      "Event": 4,
                      "Arguments": [
                        "candle_lit",
                        "true"
                      ]
                    }
                  ]
                },
                {
                  "Event": 3,
                  "ItemId": "salt",
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "You carefully pour the blessed salt in a circle around the remains."
                      ]
                    },
                    {
                      "Event": 4,
                      "Arguments": [
                        "salt_circle",
                        "true"
                      ]
                    }
                  ]
                },
                {
                  "Event": 3,
                  "ItemId": "locket",
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "You place Elizabeth's locket with her remains. A powerful energy builds in the room as the ritual nears completion..."
                      ]
                    },
                    {
                      "Event": 4,
                      "Arguments": [
                        "ritual_complete",
                        "true"
                      ]
                    }
                  ]
                }
              ],
              "Flags": []
            },
            {
              "Name": "Ritual Completion",
              "Description": "The ritual components are in place...",
              "Events": [
                {
                  "Event": 1,
                  "Actions": [
                    {
                      "Event": 0,
                      "Arguments": [
                        "With all the components in place, a blinding light fills the room! Elizabeth's spirit appears one final time - but now her face is peaceful. 'Thank you for freeing me,' she whispers, before fading away forever. You've successfully completed the ritual and laid her spirit to rest."
                      ]
                    }
                  ]
                }
              ],
              "Flags": [
                {
                  "Flag": true,
                  "Name": "candle_placed"
                },
                {
                  "Flag": true,
                  "Name": "candle_lit"
                },
                {
                  "Flag": true,
                  "Name": "salt_circle"
                },
                {
                  "Flag": true,
                  "Name": "ritual_complete"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default templateGame;