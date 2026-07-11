const THI = {};

THI.ASCII = `
_________________________________________________________________________________________________________________________
_________          _______            _________ ______   ______   _______  _         _________ _______  _        _______
\\__   __/|\\     /|(  ____ \\  |\\     /|\\__   __/(  __  \\ (  __  \\ (  ____ \\( (    /|  \\__   __/(  ____ \\( \\      (  ____ \\
   ) (   | )   ( || (    \\/  | )   ( |   ) (   | (  \\  )| (  \\  )| (    \\/|  \\  ( |     ) (   | (    \\/| (      | (    \\/
   | |   | (___) || (__      | (___) |   | |   | |   ) || |   ) || (__    |   \\ | |     | |   | (_____ | |      | (__
   | |   |  ___  ||  __)     |  ___  |   | |   | |   | || |   | ||  __)   | (\\ \\) |     | |   (_____  )| |      |  __)
   | |   | (   ) || (        | (   ) |   | |   | |   ) || |   ) || (      | | \\   |     | |         ) || |      | (
   | |   | )   ( || (____/\\  | )   ( |___) (___| (__/  )| (__/  )| (____/\\| )  \\  |  ___) (___/\\____) || (____/\\| (____/\\
   )_(   |/     \\|(_______/  |/     \\|\\_______/(______/ (______/ (_______/|/    )_)  \\_______/\\_______)(_______/(_______/

=========================================================================================================================`;

THI.DEFAULT = {
  pipDeck: "Compendium.thi.decks.Cards.xYpJgsw04rnokwPo",
  visionDeck: "Compendium.thi.decks.Cards.tbapE4O1OVUbfeAd"
};

THI.baseItems = {
  blade: {
    name: 'THI.Agent.Items.Base.Blade',
    consumable: false,
    used: false
  },
  charm: {
    name: 'THI.Agent.Items.Base.Charm',
    consumable: true,
    used: false
  },
  documents: {
    name: 'THI.Agent.Items.Base.Documents',
    consumable: true,
    used: false
  },
  cards: {
    name: 'THI.Agent.Items.Base.Cards',
    consumable: false,
    used: false
  },
  seal: {
    name: 'THI.Agent.Items.Base.Seal',
    consumable: false,
    used: false
  },
  flare: {
    name: 'THI.Agent.Items.Base.Flare',
    consumable: true,
    used: false
  }
}

THI.clockMaxes = [3, 4, 6, 8];

THI.harm = {
  none: {
    label: "THI.Harm.None",
    abbr: "N"
  },
  physical: {
    label: "THI.Harm.Physical",
    abbr: "P"
  },
  spiritual: {
    label: "THI.Harm.Spiritual",
    abbr: "S"
  },
  trauma: {
    label: "THI.Harm.Trauma",
    abbr: "T"
  }
};

THI.arcana = {
  minor: {
    swords: {
      suit: "swords",
      cards: {
        ace: {
          label: "THI.Arcana.Court.Swords.Ace",
          value: 1,
        },
        two: {
          label: "THI.Arcana.Court.Swords.Two",
          value: 2,
        },
        three: {
          label: "THI.Arcana.Court.Swords.Three",
          value: 3,
        },
        four: {
          label: "THI.Arcana.Court.Swords.Four",
          value: 4,
        },
        five: {
          label: "THI.Arcana.Court.Swords.Five",
          value: 5,
        },
        six: {
          label: "THI.Arcana.Court.Swords.Six",
          value: 6,
        },
        seven: {
          label: "THI.Arcana.Court.Swords.Seven",
          value: 7,
        },
        eight: {
          label: "THI.Arcana.Court.Swords.Eight",
          value: 8,
        },
        nine: {
          label: "THI.Arcana.Court.Swords.Nine",
          value: 9,
        },
        ten: {
          label: "THI.Arcana.Court.Swords.Ten",
          value: 10,
        }
      }
    },
    cups: {
      suit: "cups",
      cards: {
        ace: {
          label: "THI.Arcana.Court.Cups.Ace",
          value: 1,
        },
        two: {
          label: "THI.Arcana.Court.Cups.Two",
          value: 2,
        },
        three: {
          label: "THI.Arcana.Court.Cups.Three",
          value: 3,
        },
        four: {
          label: "THI.Arcana.Court.Cups.Four",
          value: 4,
        },
        five: {
          label: "THI.Arcana.Court.Cups.Five",
          value: 5,
        },
        six: {
          label: "THI.Arcana.Court.Cups.Six",
          value: 6,
        },
        seven: {
          label: "THI.Arcana.Court.Cups.Seven",
          value: 7,
        },
        eight: {
          label: "THI.Arcana.Court.Cups.Eight",
          value: 8,
        },
        nine: {
          label: "THI.Arcana.Court.Cups.Nine",
          value: 9,
        },
        ten: {
          label: "THI.Arcana.Court.Cups.Ten",
          value: 10,
        }
      }
    },
    wands: {
      suit: "wands",
      cards: {
        ace: {
          label: "THI.Arcana.Court.Wands.Ace",
          value: 1,
        },
        two: {
          label: "THI.Arcana.Court.Wands.Two",
          value: 2,
        },
        three: {
          label: "THI.Arcana.Court.Wands.Three",
          value: 3,
        },
        four: {
          label: "THI.Arcana.Court.Wands.Four",
          value: 4,
        },
        five: {
          label: "THI.Arcana.Court.Wands.Five",
          value: 5,
        },
        six: {
          label: "THI.Arcana.Court.Wands.Six",
          value: 6,
        },
        seven: {
          label: "THI.Arcana.Court.Wands.Seven",
          value: 7,
        },
        eight: {
          label: "THI.Arcana.Court.Wands.Eight",
          value: 8,
        },
        nine: {
          label: "THI.Arcana.Court.Wands.Nine",
          value: 9,
        },
        ten: {
          label: "THI.Arcana.Court.Wands.Ten",
          value: 10,
        }
      }
    },
    pentacles: {
      suit: "pentacles",
      cards: {
        ace: {
          label: "THI.Arcana.Court.Pentacles.Ace",
          value: 1,
        },
        two: {
          label: "THI.Arcana.Court.Pentacles.Two",
          value: 2,
        },
        three: {
          label: "THI.Arcana.Court.Pentacles.Three",
          value: 3,
        },
        four: {
          label: "THI.Arcana.Court.Pentacles.Four",
          value: 4,
        },
        five: {
          label: "THI.Arcana.Court.Pentacles.Five",
          value: 5,
        },
        six: {
          label: "THI.Arcana.Court.Pentacles.Six",
          value: 6,
        },
        seven: {
          label: "THI.Arcana.Court.Pentacles.Seven",
          value: 7,
        },
        eight: {
          label: "THI.Arcana.Court.Pentacles.Eight",
          value: 8,
        },
        nine: {
          label: "THI.Arcana.Court.Pentacles.Nine",
          value: 9,
        },
        ten: {
          label: "THI.Arcana.Court.Pentacles.Ten",
          value: 10,
        }
      }
    }
  },
  court: {
    swordspage: {
      label: "THI.Arcana.Court.Swords.Page"
    },
    swordsknight: {
      label: "THI.Arcana.Court.Swords.Knight"
    },
    swordsqueen: {
      label: "THI.Arcana.Court.Swords.Queen"
    },
    swordsking: {
      label: "THI.Arcana.Court.Swords.King"
    },
    cupspage: {
      label: "THI.Arcana.Court.Cups.Page"
    },
    cupsknight: {
      label: "THI.Arcana.Court.Cups.Knight"
    },
    cupsqueen: {
      label: "THI.Arcana.Court.Cups.Queen"
    },
    cupsking: {
      label: "THI.Arcana.Court.Cups.King"
    },
    wandspage: {
      label: "THI.Arcana.Court.Wands.Page"
    },
    wandsknight: {
      label: "THI.Arcana.Court.Wands.Knight"
    },
    wandsqueen: {
      label: "THI.Arcana.Court.Wands.Queen"
    },
    wandsking: {
      label: "THI.Arcana.Court.Wands.King"
    },
    pentaclespage: {
      label: "THI.Arcana.Court.Pentacles.Page"
    },
    pentaclesknight: {
      label: "THI.Arcana.Court.Pentacles.Knight"
    },
    pentaclesqueen: {
      label: "THI.Arcana.Court.Pentacles.Queen"
    },
    pentaclesking: {
      label: "THI.Arcana.Court.Pentacles.King"
    }
  },
  major: {
    fool: {
      label: "THI.Arcana.Major.Fool"
    },
    magician: {
      label: "THI.Arcana.Major.Magician"
    },
    priestess: {
      label: "THI.Arcana.Major.Priestess"
    },
    empress: {
      label: "THI.Arcana.Major.Empress"
    },
    emperor: {
      label: "THI.Arcana.Major.Emperor"
    },
    hierophant: {
      label: "THI.Arcana.Major.Hierophant"
    },
    lovers: {
      label: "THI.Arcana.Major.Lovers"
    },
    chariot: {
      label: "THI.Arcana.Major.Chariot"
    },
    strength: {
      label: "THI.Arcana.Major.Strength"
    },
    hermit: {
      label: "THI.Arcana.Major.Hermit"
    },
    fortune: {
      label: "THI.Arcana.Major.Fortune"
    },
    justice: {
      label: "THI.Arcana.Major.Justice"
    },
    death: {
      label: "THI.Arcana.Major.Death"
    },
    hanged: {
      label: "THI.Arcana.Major.Hanged"
    },
    temperance: {
      label: "THI.Arcana.Major.Temperance"
    },
    devil: {
      label: "THI.Arcana.Major.Devil"
    },
    tower: {
      label: "THI.Arcana.Major.Tower"
    },
    star: {
      label: "THI.Arcana.Major.Star"
    },
    moon: {
      label: "THI.Arcana.Major.Moon"
    },
    sun: {
      label: "THI.Arcana.Major.Sun"
    },
    gate: {
      label: "THI.Arcana.Major.Gate"
    },
    world: {
      label: "THI.Arcana.Major.World"
    }
  }
};

export default THI;
