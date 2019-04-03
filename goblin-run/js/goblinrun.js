var GoblinRun;
(function (GoblinRun) {
    GoblinRun.sponsorName = "none";
    var Global = /** @class */ (function () {
        function Global() {
        }
        // sponsor
        Global.sponsor = null;
        // game size
        Global.GAME_WIDTH = 1024;
        Global.GAME_HEIGHT = 640;
        // credits text
        Global.CREDITS_TEXT = "CODE:\n Xentube Games\n\nProduction:\n Forestry Games";
        return Global;
    }());
    GoblinRun.Global = Global;
})(GoblinRun || (GoblinRun = {}));
// -------------------------------------------------------------------------
window.onload = function () {
    console.log("Sponsor = " + GoblinRun.sponsorName);
    var sponsor = GoblinRun.Sponsors.SPONSORS[GoblinRun.sponsorName];
    if (typeof sponsor === "undefined") {
        console.error("Sponsor " + GoblinRun.sponsorName + " is not defined!");
    }
    else {
        GoblinRun.Global.sponsor = sponsor;
        var sponsorID = sponsor.id;
        if (sponsorID === 2 /* CLOUDGAMES */) {
            var game = new GoblinRun.Game();
            GoblinRun.Global.game = game;
            sponsor.sdk = new Sponsor.SponsorCloudGames(game, 390 /* game ID assigned by CloudGames*/);
        }
        else if (sponsorID === 3 /* GAMEARTER */) {
            try {
                var allowedDomains = ["pacogames.com", "gamearter.com"], host = document.location.href.split("/")[2].split("."), fullHost = host[host.length - 2] + "." + host[host.length - 1];
                if (allowedDomains.indexOf(fullHost) > -1) {
                    var game = new GoblinRun.Game();
                    GoblinRun.Global.game = game;
                    sponsor.sdk = new Sponsor.SponsorGameArter(game);
                }
                else {
                    alert("Please, load the game from PacoGames.com");
                }
            }
            catch (e) {
                alert("Some kind of problem occured. Please, let us know about the problem at content@pacogames.com");
            }
        }
        else {
            console.log("Default sponsor adapter for sponsor " + GoblinRun.sponsorName);
            var game = new GoblinRun.Game();
            GoblinRun.Global.game = game;
            sponsor.sdk = new Sponsor.SponsorAdapter(game);
        }
    }
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GoblinRun;
(function (GoblinRun) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        // -------------------------------------------------------------------------
        function Game() {
            var _this = 
            // init game
            _super.call(this, GoblinRun.Global.GAME_WIDTH, GoblinRun.Global.GAME_HEIGHT, Phaser.AUTO, "content") || this;
            // load saved settings
            GoblinRun.Preferences.instance.load();
            // states
            _this.state.add("Boot", GoblinRun.Boot);
            _this.state.add("Preload", GoblinRun.Preload);
            _this.state.add("Play", GoblinRun.Play);
            _this.state.add("Menu", GoblinRun.Menu);
            _this.state.add("Tutorial", GoblinRun.Tutorial);
            // start
            _this.state.start("Boot");
            return _this;
        }
        return Game;
    }(Phaser.Game));
    GoblinRun.Game = Game;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Animations = /** @class */ (function () {
        function Animations() {
        }
        Animations.SPIKE_ANIM = ["Spikes1", "Spikes2", "Spikes3", "Spikes4", "Spikes3", "Spikes2"];
        Animations.BONUS_JUMP_ANIM = [
            "Bonus0", "Bonus1", "Bonus2", "Bonus3", "Bonus4",
            "Bonus4", "Bonus4", "Bonus3", "Bonus2", "Bonus1",
            "Bonus0", "Bonus5", "Bonus6", "Bonus7", "Bonus8",
            "Bonus8", "Bonus8", "Bonus7", "Bonus6", "Bonus5"
        ];
        return Animations;
    }());
    GoblinRun.Animations = Animations;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Background = /** @class */ (function (_super) {
        __extends(Background, _super);
        // -------------------------------------------------------------------------
        function Background(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            _this._nextTree = 0;
            // heights
            var treesHeight = game.cache.getImage("TreesBg").height;
            var hillHeight = game.cache.getImage("Hill").height;
            var mudHeight = game.cache.getImage("Mud").height;
            // trees bg
            //this._treesBg = new Phaser.TileSprite(game, 0, 0, game.width, treesHeight, "TreesBg");
            //this._treesBg.fixedToCamera = true;
            //this.add(this._treesBg);
            _this._treesBg = new GoblinRun.BgLayer(_this.game, _this, "TreesBg", 0, 0, 0.25);
            // trees group / pool
            _this._trees = new Phaser.Group(game, _this);
            _this._trees.createMultiple(4, "Sprites", "Tree", false);
            // width of tree sprite
            _this._treeWidth = game.cache.getFrameByName("Sprites", "Tree").width;
            // hill
            //this._hill = new Phaser.TileSprite(game, 0, game.height - mudHeight - hillHeight, game.width, hillHeight, "Hill");
            //this._hill.fixedToCamera = true;
            //this.add(this._hill);
            _this._hill = new GoblinRun.BgLayer(_this.game, _this, "Hill", 0, 1, 0.5);
            _this._hill.y = _this.game.height - mudHeight;
            // mud
            //this._mud = new Phaser.TileSprite(game, 0, game.height - mudHeight, game.width, mudHeight, "Mud");
            //this._mud.fixedToCamera = true;
            //this.add(this._mud);
            _this._mud = new GoblinRun.BgLayer(_this.game, _this, "Mud", 0, 1, 1);
            _this._mud.y = _this.game.height;
            return _this;
        }
        // -------------------------------------------------------------------------
        Background.prototype.updateLayers = function (x) {
            // move all three tilesprites
            //this._mud.tilePosition.x = -x + Math.sin(Phaser.Math.degToRad((this.game.time.time / 30) % 360)) * 20;
            //this._hill.tilePosition.x = -x * 0.5;
            //this._treesBg.tilePosition.x = -x * 0.25;
            this._mud.updatePosition(x + Math.sin(Phaser.Math.degToRad((this.game.time.time / 30) % 360)) * 20);
            this._hill.updatePosition(x);
            this._treesBg.updatePosition(x);
            // move trees layer and remove/add trees
            this.manageTrees(x * 0.5);
        };
        // -------------------------------------------------------------------------
        Background.prototype.manageTrees = function (x) {
            // move trees layer
            this._trees.x = x;
            // remove old
            this._trees.forEachExists(function (tree) {
                if (tree.x < x - this._treeWidth) {
                    tree.exists = false;
                }
            }, this);
            // add new tree(s)
            while (this._nextTree < x + this.game.width) {
                // save new tree position
                var treeX = this._nextTree;
                // calcultate position for next tree
                this._nextTree += this.game.rnd.integerInRange(Background.TREE_DIST_MIN, Background.TREE_DIST_MAX);
                // get unused tree sprite
                var tree = this._trees.getFirstExists(false);
                // if no free sprites, exit loop
                if (tree === null) {
                    break;
                }
                // position tree and make it exist
                tree.x = treeX;
                tree.exists = true;
            }
        };
        // -------------------------------------------------------------------------
        Background.prototype.resize = function () {
            var newWidth = this.game.width;
            this._treesBg.width = newWidth;
            this._hill.width = newWidth;
            this._mud.width = newWidth;
        };
        Background.TREE_DIST_MIN = 300;
        Background.TREE_DIST_MAX = 800;
        return Background;
    }(Phaser.Group));
    GoblinRun.Background = Background;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var BgLayer = /** @class */ (function (_super) {
        __extends(BgLayer, _super);
        // -------------------------------------------------------------------------
        function BgLayer(game, parent, key, frame, anchorY, scrollCoef) {
            var _this = _super.call(this, game, parent) || this;
            _this._sprites = [];
            _this._crops = [];
            _this._scrollCoef = scrollCoef;
            var fr;
            if (typeof frame === "number") {
                fr = game.cache.getFrameByIndex(key, frame);
            }
            else {
                fr = game.cache.getFrameByName(key, frame);
            }
            _this._frame = fr;
            // number of sprites
            var count = Math.ceil(_this.game.width / fr.width) + 1;
            for (var i = 0; i < count; i++) {
                var spr = game.add.sprite(0, 0, key, frame, _this);
                spr.anchor.y = anchorY;
                spr.fixedToCamera = true;
                var crop = new Phaser.Rectangle(0, 0, 0, fr.height);
                spr.crop(crop, false);
                _this._sprites.push(spr);
                _this._crops.push(crop);
            }
            _this.updatePosition(0);
            return _this;
        }
        // -------------------------------------------------------------------------
        BgLayer.prototype.updatePosition = function (x) {
            x *= this._scrollCoef;
            var frameWidth = this._frame.sourceSizeW;
            var offset = ((x % frameWidth) + frameWidth) % frameWidth;
            //console.log("camera.y = " + y + ", offset = " + offset);
            var remaningWidth = this.game.width;
            //let s = "";
            for (var i = 0; i < this._sprites.length; i++) {
                var spr = this._sprites[i];
                var crop = this._crops[i];
                crop.x = offset;
                crop.width = Math.min(frameWidth - offset, remaningWidth);
                spr.cameraOffset.x = this.game.width - remaningWidth;
                spr.updateCrop();
                //s += "sprite " + i + " - y = " + spr.cameraOffset.y + ", off = " + offset + ", height = " + crop.height + " | ";
                remaningWidth -= crop.width;
                offset = (offset + crop.width) % frameWidth;
            }
            //console.log(s);
        };
        return BgLayer;
    }(Phaser.Group));
    GoblinRun.BgLayer = BgLayer;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var BlockDefs = /** @class */ (function () {
        function BlockDefs() {
        }
        BlockDefs.PLATFORM = [
            [
                { name: "PlatformLeft", anchorX: 0, anchorY: 0.2, bodyOffsetX: 0, bodyOffsetY: 16, bodyWidth: 64, bodyHeight: 48 },
                { name: "PlatformMiddle", anchorX: 0, anchorY: 0.2, bodyOffsetX: 0, bodyOffsetY: 16, bodyWidth: 64, bodyHeight: 48 },
                { name: "PlatformRight", anchorX: 0, anchorY: 0.2, bodyOffsetX: 0, bodyOffsetY: 16, bodyWidth: 64, bodyHeight: 48 }
            ]
        ];
        BlockDefs.BLOCK = [
            [
                { name: "BlockTopLeft", anchorX: 0, anchorY: 0.2, bodyOffsetX: 0, bodyOffsetY: 16, bodyWidth: 64, bodyHeight: 64 },
                { name: "BlockTopMiddle", anchorX: 0, anchorY: 0.2, bodyOffsetX: 0, bodyOffsetY: 16, bodyWidth: 64, bodyHeight: 64 },
                { name: "BlockTopRight", anchorX: 0, anchorY: 0.2, bodyOffsetX: 0, bodyOffsetY: 16, bodyWidth: 64, bodyHeight: 64 }
            ],
            [
                { name: "BlockMiddleLeft", anchorX: 0, anchorY: 0, bodyOffsetX: 0, bodyOffsetY: 0, bodyWidth: 64, bodyHeight: 64 },
                { name: "BlockMiddleMiddle", anchorX: 0, anchorY: 0, bodyOffsetX: 0, bodyOffsetY: 0, bodyWidth: 64, bodyHeight: 64 },
                { name: "BlockMiddleRight", anchorX: 0, anchorY: 0, bodyOffsetX: 0, bodyOffsetY: 0, bodyWidth: 64, bodyHeight: 64 }
            ],
            [
                { name: "BlockBottomLeft", anchorX: 0, anchorY: 0, bodyOffsetX: 0, bodyOffsetY: 0, bodyWidth: 64, bodyHeight: 64 },
                { name: "BlockBottomMiddle", anchorX: 0, anchorY: 0, bodyOffsetX: 0, bodyOffsetY: 0, bodyWidth: 64, bodyHeight: 64 },
                { name: "BlockBottomRight", anchorX: 0, anchorY: 0, bodyOffsetX: 0, bodyOffsetY: 0, bodyWidth: 64, bodyHeight: 64 }
            ]
        ];
        BlockDefs.LOW_BLOCK = [
            [
                { name: "LowBlockLeft", anchorX: 0, anchorY: 0.2, bodyOffsetX: 0, bodyOffsetY: 16, bodyWidth: 64, bodyHeight: 64 },
                { name: "LowBlockMiddle", anchorX: 0, anchorY: 0.2, bodyOffsetX: 0, bodyOffsetY: 16, bodyWidth: 64, bodyHeight: 64 },
                { name: "LowBlockRight", anchorX: 0, anchorY: 0.2, bodyOffsetX: 0, bodyOffsetY: 16, bodyWidth: 64, bodyHeight: 64 }
            ]
        ];
        // SPIKES
        //public static SPIKES: ITileDef = { name: "spikes", anchorX: 0.5, anchorY: 1, bodyOffsetX: 9, bodyOffsetY: 17, bodyWidth: 45, bodyHeight: 34 };
        BlockDefs.SPIKES = [
            { name: "spikes", anchorX: 0, anchorY: 1, bodyOffsetX: 9, bodyOffsetY: 17, bodyWidth: 45, bodyHeight: 34 },
            { name: "spikes", anchorX: 1, anchorY: 1, bodyOffsetX: 9, bodyOffsetY: 17, bodyWidth: 45, bodyHeight: 34 },
            { name: "spikes", anchorX: 0.5, anchorY: 1, bodyOffsetX: 9, bodyOffsetY: 17, bodyWidth: 45, bodyHeight: 34 } // center
        ];
        // BONUS JUMP
        BlockDefs.BONUS_JUMP = { name: "bonusJump", anchorX: 0.5, anchorY: 0.5, bodyOffsetX: 7, bodyOffsetY: 7, bodyWidth: 50, bodyHeight: 50 };
        // GOLD
        BlockDefs.GOLD = { name: "Gold", anchorX: 0.5, anchorY: 1, bodyOffsetX: 0, bodyOffsetY: 0, bodyWidth: 43, bodyHeight: 43 };
        return BlockDefs;
    }());
    GoblinRun.BlockDefs = BlockDefs;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Item = /** @class */ (function (_super) {
        __extends(Item, _super);
        function Item() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Item;
    }(Phaser.Sprite));
    GoblinRun.Item = Item;
    var MainLayer = /** @class */ (function (_super) {
        __extends(MainLayer, _super);
        // -------------------------------------------------------------------------
        function MainLayer(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            _this._timeForGold = MainLayer.GOLD_COUNTER_MIN;
            _this._lastTile = new Phaser.Point(0, 0);
            // platforms generator
            _this._generator = new Generator.Generator(game.rnd);
            _this._generator.onRandomPlatform.add(_this.onRandomPlatform, _this);
            _this._generator.onPatternPlatform.add(_this.onPatternPlatform, _this);
            // object that holds level difficulty progress
            _this._difficulty = new Generator.Difficulty(game.rnd);
            // pool of walls
            _this._wallsPool = new Helper.Pool(Phaser.Sprite, 32, function () {
                // add empty sprite with body
                var sprite = new Phaser.Sprite(game, 0, 0, "Sprites");
                game.physics.enable(sprite, Phaser.Physics.ARCADE);
                var body = sprite.body;
                body.allowGravity = false;
                body.immovable = true;
                body.moves = false;
                body.setSize(64, 64, 0, 0);
                return sprite;
            });
            // walls group
            _this._walls = new Phaser.Group(game, _this);
            // pool of items
            _this._itemsPool = new Helper.Pool(Item, 32, function () {
                // empty item
                var item = new Item(game, 0, 0, "Sprites");
                // add animations
                item.animations.add("spikes", GoblinRun.Animations.SPIKE_ANIM, 10, true);
                item.animations.add("bonusJump", GoblinRun.Animations.BONUS_JUMP_ANIM, 10, true);
                // enable physics
                game.physics.enable(item, Phaser.Physics.ARCADE);
                // setup physics
                var body = item.body;
                body.allowGravity = false;
                body.immovable = true;
                body.moves = false;
                return item;
            });
            // items group
            _this._items = new Phaser.Group(game, _this);
            // record
            var recordDistance = GoblinRun.Preferences.instance.record;
            if (recordDistance > 0) {
                var record = new GoblinRun.Record(game, _this, recordDistance);
                _this.add(record);
            }
            // emitters
            _this.constructEmitters();
            // set initial tile for generating
            // this._piece = this._generator.setPiece(0, 5, 10);
            _this._generator.setPiece(0, 5, 10);
            _this._state = 0 /* PROCESS_PIECE */;
            return _this;
        }
        // -------------------------------------------------------------------------
        MainLayer.prototype.render = function () {
            //this._walls.forEachExists(function (sprite: Phaser.Sprite) {
            //    this.game.debug.body(sprite);
            //}, this);
            this._items.forEachExists(function (item) {
                this.game.debug.body(item);
            }, this);
        };
        // -------------------------------------------------------------------------
        MainLayer.prototype.constructEmitters = function () {
            // bonus jump
            var emitter = new Phaser.Particles.Arcade.Emitter(this.game, 0, 0, 5);
            emitter.makeParticles("Sprites", "Bonus0");
            emitter.setXSpeed(0, 0);
            emitter.setYSpeed(0, 0);
            emitter.setRotation(-360, -360);
            emitter.lifespan = 500;
            emitter.setScale(1.0, 0, 1.0, 0, 500);
            emitter.gravity = new Phaser.Point(0, -Generator.Parameters.GRAVITY);
            this.add(emitter);
            this._bonusEmitter = emitter;
            // gold
            emitter = new Phaser.Particles.Arcade.Emitter(this.game, 0, 0, 48);
            emitter.makeParticles("Sprites", "GoldParticle");
            emitter.setXSpeed(-150, 150);
            emitter.setYSpeed(-200, 50);
            emitter.setRotation(0, 0);
            emitter.lifespan = 550;
            emitter.setScale(1.0, 0, 1.0, 0, 550);
            emitter.gravity = new Phaser.Point(0, -Generator.Parameters.GRAVITY);
            this.add(emitter);
            this._goldEmitter = emitter;
        };
        // -------------------------------------------------------------------------
        MainLayer.prototype.generate = function (leftTile) {
            // remove tiles too far to left
            this.cleanTiles(leftTile);
            // do the same for items
            this.cleanItems(leftTile);
            // width of screen rounded to whole tiles up
            var width = Math.ceil(this.game.width / Generator.Parameters.CELL_SIZE);
            // generate platforms until we generate platform that ends out of the screen on right
            while (this._lastTile.x < leftTile + width) {
                switch (this._state) {
                    case 0 /* PROCESS_PIECE */:
                        {
                            // check if queue not empty - should never happen
                            if (!this._generator.hasPieces) {
                                console.error("Pieces queue is empty!");
                            }
                            var piece = this._generator.getPieceFromQueue();
                            this._lastTile.copyFrom(piece.position);
                            var length_1 = piece.length;
                            var tileType = 0 /* LEFT */;
                            // decrease gold counter
                            if (!piece.bonusJump && piece.spikesPattern === 0) {
                                --this._timeForGold;
                            }
                            // process piece
                            while (length_1 > 0) {
                                if (piece.bonusJump) {
                                    this.addBonus(this._lastTile.x, this._lastTile.y);
                                }
                                else {
                                    this.addTiles(this._lastTile.x, this._lastTile.y, tileType, piece.isPlatform, (piece.spikesPattern >> ((length_1 - 1) * 2)) & 0x03
                                    /*(piece.spikesPattern & (1 << (length - 1))) > 0*/ );
                                    // add gold
                                    if (this._timeForGold === 0 && length_1 > 1) {
                                        this.addGold(this._lastTile.x, this._lastTile.y);
                                    }
                                }
                                if ((--length_1) > 0) {
                                    ++this._lastTile.x;
                                }
                                tileType = (length_1 === 1) ? 2 /* RIGHT */ : 1 /* MIDDLE */;
                            }
                            // reset gold counter?
                            if (this._timeForGold === 0) {
                                this._timeForGold = this.game.rnd.integerInRange(MainLayer.GOLD_COUNTER_MIN, MainLayer.GOLD_COUNTER_MAX);
                            }
                            // return processed piece into pool
                            this._generator.destroyPiece(piece);
                            // generate next platform
                            if (!this._generator.hasPieces) {
                                this._state = 1 /* GENERATE_PIECE */;
                            }
                            break;
                        }
                    case 1 /* GENERATE_PIECE */:
                        {
                            this._difficulty.update(leftTile);
                            this._generator.generatePieces(this._lastTile, this._difficulty);
                            this._state = 0 /* PROCESS_PIECE */;
                            break;
                        }
                }
            }
        };
        // -------------------------------------------------------------------------
        MainLayer.prototype.cleanTiles = function (leftTile) {
            leftTile *= Generator.Parameters.CELL_SIZE;
            for (var i = this._walls.length - 1; i >= 0; i--) {
                var wall = this._walls.getChildAt(i);
                if (wall.x - leftTile <= -64) {
                    this._walls.remove(wall);
                    wall.parent = null;
                    this._wallsPool.destroyItem(wall);
                }
            }
        };
        // -------------------------------------------------------------------------
        MainLayer.prototype.cleanItems = function (leftTile) {
            leftTile *= Generator.Parameters.CELL_SIZE;
            for (var i = this._items.length - 1; i >= 0; i--) {
                var item = this._items.getChildAt(i);
                if (item.x - leftTile <= -64) {
                    this._items.remove(item);
                    item.parent = null;
                    this._itemsPool.destroyItem(item);
                }
            }
        };
        // -------------------------------------------------------------------------
        MainLayer.prototype.addTiles = function (x, y, type, platform, spike /*boolean*/) {
            var defs;
            // find right defs
            if (platform) {
                defs = GoblinRun.BlockDefs.PLATFORM;
            }
            else if (y === Generator.Parameters.LBOUND) {
                defs = GoblinRun.BlockDefs.LOW_BLOCK;
            }
            else {
                defs = GoblinRun.BlockDefs.BLOCK;
            }
            // number of vertical tiles
            var rowsCount = platform ? 1 : Generator.Parameters.LBOUND - y + 1;
            for (var r = y; r < y + rowsCount; r++) {
                // find correct block definition
                var blockDef = void 0;
                if (defs !== GoblinRun.BlockDefs.BLOCK) {
                    blockDef = defs[0][type];
                }
                else {
                    if (r === y) {
                        blockDef = defs[0][type];
                    }
                    else if (r < y + rowsCount - 1) {
                        blockDef = defs[1][type];
                    }
                    else {
                        blockDef = defs[2][type];
                    }
                }
                // sprite  get from pool
                var sprite = this._wallsPool.createItem();
                sprite.position.set(x * 64, r * 64);
                sprite.exists = true;
                sprite.visible = true;
                // adjust sprite to match block definition
                sprite.frameName = blockDef.name;
                sprite.anchor.set(blockDef.anchorX, blockDef.anchorY);
                var body = sprite.body;
                body.setSize(blockDef.bodyWidth, blockDef.bodyHeight, blockDef.bodyOffsetX, blockDef.bodyOffsetY);
                // add into walls group
                if (sprite.parent === null) {
                    this._walls.add(sprite);
                }
                // spikes
                if (spike && r === y) {
                    var spikeSprite = this._itemsPool.createItem();
                    spikeSprite.itemType = 0 /* SPIKE */;
                    spikeSprite.position.set(x * 64 + 32, r * 64 + MainLayer.OFFSET_SPIKE /*8*/);
                    spikeSprite.exists = true;
                    spikeSprite.visible = true;
                    this.setupItem(spikeSprite, GoblinRun.BlockDefs.SPIKES[spike - 1], true, true);
                    if (spikeSprite.parent === null) {
                        this._items.add(spikeSprite);
                    }
                }
            }
        };
        // -------------------------------------------------------------------------
        MainLayer.prototype.addBonus = function (x, y) {
            var jumpBonus = this._itemsPool.createItem();
            jumpBonus.itemType = 1 /* BONUS_JUMP */;
            jumpBonus.position.set(x * 64 + 32, y * 64);
            jumpBonus.exists = true;
            jumpBonus.visible = true;
            this.setupItem(jumpBonus, GoblinRun.BlockDefs.BONUS_JUMP, true, false);
            if (jumpBonus.parent === null) {
                this._items.add(jumpBonus);
            }
        };
        // -------------------------------------------------------------------------
        MainLayer.prototype.addGold = function (x, y) {
            var gold = this._itemsPool.createItem();
            gold.itemType = 2 /* GOLD */;
            gold.position.set(x * 64 + 64, y * 64 + 8);
            gold.exists = true;
            gold.visible = true;
            this.setupItem(gold, GoblinRun.BlockDefs.GOLD, false, false);
            if (gold.parent === null) {
                this._items.add(gold);
            }
        };
        // -------------------------------------------------------------------------
        MainLayer.prototype.removeItem = function (item) {
            // make particle effect
            if (item.itemType === 1 /* BONUS_JUMP */) {
                this._bonusEmitter.emitX = item.x;
                this._bonusEmitter.emitY = item.y;
                this._bonusEmitter.emitParticle();
            }
            else if (item.itemType === 2 /* GOLD */) {
                this._goldEmitter.emitX = item.x;
                this._goldEmitter.emitY = item.y - 25;
                this._goldEmitter.explode(500, 12);
            }
            // remove item
            this._items.remove(item);
            item.parent = null;
            this._itemsPool.destroyItem(item);
        };
        // -------------------------------------------------------------------------
        MainLayer.prototype.setupItem = function (item, def, animated, syncAnim) {
            // anchor
            item.anchor.set(def.anchorX, def.anchorY);
            // body dimensions and offset
            item.body.setSize(def.bodyWidth, def.bodyHeight, def.bodyOffsetX, def.bodyOffsetY);
            if (animated) {
                item.animations.play(def.name);
                // if request to synchronize animation with other items of the same type
                if (syncAnim) {
                    var prevItem = this.getItemOfType(item.itemType);
                    if (prevItem !== null) {
                        item.animations.currentAnim["_frameIndex"] = prevItem.animations.currentAnim["_frameIndex"];
                        item.animations.currentAnim["_timeNextFrame"] = prevItem.animations.currentAnim["_timeNextFrame"];
                    }
                }
            }
            else {
                // stop any previous animation
                item.animations.stop();
                // set frame
                item.frameName = def.name;
            }
        };
        // -------------------------------------------------------------------------
        MainLayer.prototype.getItemOfType = function (type) {
            for (var i = 0; i < this._items.length; i++) {
                var object = this._items.getChildAt(i);
                if (object.itemType === type) {
                    return object;
                }
            }
            return null;
        };
        Object.defineProperty(MainLayer.prototype, "walls", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._walls;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainLayer.prototype, "items", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._items;
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        MainLayer.prototype.onRandomPlatform = function (piece, previous) {
            this.setPlatform(piece);
        };
        // -------------------------------------------------------------------------
        MainLayer.prototype.onPatternPlatform = function (piece, previous, position, repeat, template) {
            // first platform in pattern?
            if (position === 0 && repeat === 0) {
                this.setPlatform(piece);
            }
            else if (repeat === 0) {
                // randomly decide on whether to follow previous piece setting
                if (this.game.rnd.integerInRange(0, 99) < 50) {
                    piece.isPlatform = previous.isPlatform;
                }
                else {
                    this.setPlatform(piece);
                }
            }
            else {
                // high probability to follow base pices settings
                if (this.game.rnd.integerInRange(0, 99) < 90) {
                    piece.isPlatform = template.isPlatform;
                }
                else {
                    this.setPlatform(piece);
                }
            }
        };
        // -------------------------------------------------------------------------
        MainLayer.prototype.setPlatform = function (piece) {
            // draw as block or platform?
            var platformProb = 100 - (piece.position.y - Generator.Parameters.UBOUND) * 20;
            piece.isPlatform = this.game.rnd.integerInRange(0, 99) < platformProb;
        };
        MainLayer.OFFSET_SPIKE = 8;
        MainLayer.GOLD_COUNTER_MIN = 3;
        MainLayer.GOLD_COUNTER_MAX = 6;
        return MainLayer;
    }(Phaser.Group));
    GoblinRun.MainLayer = MainLayer;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var PauseScreen = /** @class */ (function (_super) {
        __extends(PauseScreen, _super);
        // -------------------------------------------------------------------------
        function PauseScreen(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            _this.onHide = new Phaser.Signal();
            _this._bg = null;
            _this._hand = null;
            _this._savedMute = false;
            _this.fixedToCamera = true;
            _this.cameraOffset.set(game.width / 2, game.height / 2);
            // bg
            _this._bg = game.add.sprite(0, 0, "Pause", "DarkBg", _this);
            _this._bg.anchor.set(0.5);
            // hand
            _this._hand = game.add.sprite(0, 50, "Pause", "touch01", _this);
            _this._hand.anchor.set(0.5);
            _this._hand.animations.add("Touch", ["touch01", "touch02", "touch03", "touch04", "touch05", "touch06",
                "touch01", "touch01", "touch01", "touch01", "touch01", "touch01", "touch01", "touch01"], 8, true, false);
            _this._savedMute = _this.game.sound.mute;
            _this.hide();
            _this.resize(game.width, game.height);
            return _this;
        }
        // -------------------------------------------------------------------------
        PauseScreen.prototype.resize = function (width, height) {
            this._bg.width = width;
            this._bg.height = height;
        };
        // -------------------------------------------------------------------------
        PauseScreen.prototype.show = function () {
            this.resize(this.game.width, this.game.height);
            this._hand.animations.play("Touch");
            this.game.sound.mute = true;
            this.exists = this.visible = true;
        };
        // -------------------------------------------------------------------------
        PauseScreen.prototype.hide = function () {
            this._hand.animations.stop();
            this.game.sound.mute = this._savedMute;
            this.exists = this.visible = false;
        };
        return PauseScreen;
    }(Phaser.Group));
    GoblinRun.PauseScreen = PauseScreen;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        // -------------------------------------------------------------------------
        function Player(game) {
            var _this = _super.call(this, game, 0, 0, "Sprites", "Empty") || this;
            // center player sprite horizontally
            _this.anchor.x = 0.5;
            // enable physics for player
            game.physics.arcade.enable(_this, false);
            // allow gravity
            var body = _this.body;
            body.allowGravity = true;
            // set body size according to values in Generator.Parameters
            var bodyW = Generator.Parameters.PLAYER_BODY_WIDTH;
            var bodyH = Generator.Parameters.PLAYER_BODY_HEIGHT;
            var bodyOffsetX = -bodyW / 2 + _this.width * _this.anchor.x;
            var bodyOffsetY = 0;
            // set body size and offset
            body.setSize(bodyW, bodyH, bodyOffsetX, bodyOffsetY);
            // create Spriter loader - class that can change Spriter file into internal structure
            var spriterLoader = new Spriter.Loader();
            // create Spriter file object - it wraps XML/JSON loaded with Phaser Loader
            var spriterFile = new Spriter.SpriterXml(game.cache.getXML("GoblinAnim"));
            // proces Spriter file (XML/JSON) with Spriter loader - outputs Spriter animation which you can instantiate multiple times with SpriterGroup
            var spriterData = spriterLoader.load(spriterFile);
            // create actual renderable object - it is extension of Phaser.Group
            _this._spriterGroup = new Spriter.SpriterGroup(_this.game, spriterData, "Sprites", "Goblin", "fall", 120);
            // set position size
            _this._spriterGroup.position.set(-5, 60);
            // adds SpriterGroup to Phaser.World to appear on screen
            _this.addChild(_this._spriterGroup);
            // mud particles emitter
            var emitter = new Phaser.Particles.Arcade.Emitter(game, 10, 60, 20);
            emitter.makeParticles("Sprites", ["MudParticle0", "MudParticle1"]);
            emitter.setXSpeed(-100, 100);
            emitter.setYSpeed(-500, -200);
            emitter.gravity = new Phaser.Point(0, -Generator.Parameters.GRAVITY + 800);
            _this.addChild(emitter);
            _this._mudEmitter = emitter;
            return _this;
        }
        Object.defineProperty(Player.prototype, "animName", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._spriterGroup.currentAnimationName;
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        Player.prototype.animateJump = function () {
            this._spriterGroup.playAnimationByName("jump");
            GoblinRun.Sounds.sfx.play("jump");
        };
        // -------------------------------------------------------------------------
        Player.prototype.animateDeath = function () {
            var body = this.body;
            body.enable = false;
            this._spriterGroup.playAnimationByName("fall_water");
            // play splash sound
            GoblinRun.Sounds.sfx.play("mud_fall");
            // play end sound with some delay
            this.game.time.events.add(1000, function () {
                GoblinRun.Sounds.sfx.play("end");
            }, this);
            // emit mud particles
            this._mudEmitter.explode(0, 20);
        };
        // -------------------------------------------------------------------------
        Player.prototype.animateHit = function () {
            this._spriterGroup.playAnimationByName("hit");
            GoblinRun.Sounds.sfx.play("hit");
        };
        // -------------------------------------------------------------------------
        Player.prototype.updateAnim = function (standing, velY, gameOver) {
            if (!gameOver) {
                if (standing) {
                    if (this._spriterGroup.currentAnimationName !== "run") {
                        this._spriterGroup.playAnimationByName("run");
                        GoblinRun.Sounds.sfx.play("land");
                    }
                }
                else if (velY > 0) {
                    if (this._spriterGroup.currentAnimationName !== "fall") {
                        this._spriterGroup.playAnimationByName("fall");
                    }
                }
            }
            this._spriterGroup.updateAnimation();
        };
        return Player;
    }(Phaser.Sprite));
    GoblinRun.Player = Player;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Record = /** @class */ (function (_super) {
        __extends(Record, _super);
        // -------------------------------------------------------------------------
        function Record(game, parent, record) {
            var _this = _super.call(this, game, parent) || this;
            // position in pixels in world
            var x = record * 64;
            // dashed line
            var line = new Phaser.Sprite(game, x, 0, "Sprites", "Record");
            line.anchor.x = 0.5;
            _this.add(line);
            // number
            var num = new Phaser.BitmapText(game, x, game.height - 15, "Font", "" + record, 40, "center");
            num.anchor.set(0.5, 1);
            _this.add(num);
            return _this;
        }
        return Record;
    }(Phaser.Group));
    GoblinRun.Record = Record;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var ScoreUI = /** @class */ (function (_super) {
        __extends(ScoreUI, _super);
        // -------------------------------------------------------------------------
        function ScoreUI(game, parent, iconName, alignLeft) {
            var _this = _super.call(this, game, parent) || this;
            // icon
            _this._icon = new Phaser.Sprite(game, 0, 0, "Sprites", iconName);
            _this._icon.anchor.set(0.5, 0.5);
            _this.add(_this._icon);
            // text
            var textPos = _this._icon.width / 2 * 1.2 * (alignLeft ? 1 : -1);
            _this._text = new Phaser.BitmapText(game, textPos, 0, "Font", "0", 40, alignLeft ? "left" : "right");
            _this._text.anchor.x = alignLeft ? 0 : 1;
            _this._text.anchor.y = 0.5;
            _this.add(_this._text);
            // tween
            _this._tween = game.add.tween(_this._icon.scale).
                to({ x: 1.2, y: 1.2 }, 100, function (k) {
                return Math.sin(Math.PI * k);
            }, false, 0);
            return _this;
        }
        Object.defineProperty(ScoreUI.prototype, "score", {
            // -------------------------------------------------------------------------
            set: function (score) {
                this._text.text = "" + score;
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        ScoreUI.prototype.bounce = function () {
            if (!this._tween.isRunning) {
                this._tween.start();
            }
        };
        return ScoreUI;
    }(Phaser.Group));
    GoblinRun.ScoreUI = ScoreUI;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Shadow = /** @class */ (function (_super) {
        __extends(Shadow, _super);
        // -------------------------------------------------------------------------
        function Shadow(game, playerPosition, walls) {
            var _this = _super.call(this, game, 0, 0, "Sprites", "Shadow") || this;
            _this._playerPosition = playerPosition;
            _this._walls = walls;
            _this.anchor.set(0.5, 0.5);
            _this.visible = false;
            return _this;
        }
        // -------------------------------------------------------------------------
        Shadow.prototype.postUpdate = function () {
            // left edge of shadow sprite
            var xLeft = this._playerPosition.x - 20;
            var minYleft = Number.MAX_VALUE;
            // right edge of shadow sprite
            var xRight = this._playerPosition.x + 20;
            var minYright = Number.MAX_VALUE;
            // go through all walls and find the top one under left and right edge
            for (var i = 0; i < this._walls.length; i++) {
                var wall = this._walls.getChildAt(i);
                // is left edge on this wall tile?
                if (wall.x <= xLeft && wall.x + 64 > xLeft) {
                    // is it higher than previous wall
                    minYleft = Math.min(minYleft, wall.y);
                }
                // is right edge on this wall tile?
                if (wall.x <= xRight && wall.x + 64 > xRight) {
                    // is it higher than previous wall
                    minYright = Math.min(minYright, wall.y);
                }
            }
            // if:
            //  1. found some tile under left edge AND
            //  2. right egde is on the same height level AND
            //  3. both are under (with higher y) player
            // then calculate shadow scale and display it
            if (minYleft < Number.MAX_VALUE && minYleft === minYright && minYleft > this._playerPosition.y) {
                // calculate x scale for shadow. Higher the player above platform, smaller the scale
                var scale = 1 / (1 + (minYleft - this._playerPosition.y) / 500);
                this.scale.x = scale;
                // update shadow position and make it visible
                this.position.set(this._playerPosition.x, minYleft);
                this.visible = true;
            }
            else {
                // if conditions for displaying shadow are not met, hide it
                this.visible = false;
            }
        };
        return Shadow;
    }(Phaser.Sprite));
    GoblinRun.Shadow = Shadow;
})(GoblinRun || (GoblinRun = {}));
var Generator;
(function (Generator) {
    var Difficulty = /** @class */ (function () {
        // -------------------------------------------------------------------------
        function Difficulty(rnd) {
            this._rnd = rnd;
            // maximum length of platform
            this._platformLengthDecrease = Generator.Parameters.PLATFORM_LENGTH_DECREASER_MIN;
            // jump width decreaser to make jumps easier in game beginnig
            this._jumpLengthDecrease = Generator.Parameters.JUMP_LENGTH_DECREASER_MIN;
            // initial spikes probability
            this._spikesProbability = Generator.Parameters.SPIKES_PROB_MIN;
            // initial bonus jump probability
            this._bonusJumpProbability = Generator.Parameters.BONUS_JUMP_PROB_MIN;
            // intial bonus jump count
            this._bonusJumpCount = Generator.Parameters.BONUS_JUMP_COUNT_MIN;
        }
        Object.defineProperty(Difficulty.prototype, "platformLengthDecrease", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._platformLengthDecrease;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Difficulty.prototype, "jumpLengthDecrease", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._jumpLengthDecrease;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Difficulty.prototype, "spikesProbability", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._spikesProbability;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Difficulty.prototype, "bonusJumpProbability", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._bonusJumpProbability;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Difficulty.prototype, "bonusJumpCount", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._bonusJumpCount;
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        Difficulty.prototype.mapLinear = function (x, a1, a2, b1, b2) {
            x = Phaser.Math.clamp(x, a1, a2);
            return Phaser.Math.mapLinear(x, a1, a2, b1, b2);
        };
        // -------------------------------------------------------------------------
        Difficulty.prototype.update = function (tileX) {
            // platform length
            this._platformLengthDecrease = Math.round(this.mapLinear(tileX, Generator.Parameters.PLATFORM_LENGTH_DECREASER_START_TILE, Generator.Parameters.PLATFORM_LENGTH_DECREASER_END_TILE, Generator.Parameters.PLATFORM_LENGTH_DECREASER_MIN, Generator.Parameters.PLATFORM_LENGTH_DECREASER_MAX));
            // jump length
            this._jumpLengthDecrease = Math.round(this.mapLinear(tileX, Generator.Parameters.JUMP_LENGTH_DECREASER_START_TILE, Generator.Parameters.JUMP_LENGTH_DECREASER_END_TILE, Generator.Parameters.JUMP_LENGTH_DECREASER_MIN, Generator.Parameters.JUMP_LENGTH_DECREASER_MAX));
            // spikes probability
            this._spikesProbability = Math.round(this.mapLinear(tileX, Generator.Parameters.SPIKES_PROB_START_TILE, Generator.Parameters.SPIKES_PROB_END_TILE, Generator.Parameters.SPIKES_PROB_MIN, Generator.Parameters.SPIKES_PROB_MAX));
            // bonus jump probability
            this._bonusJumpProbability = Math.round(this.mapLinear(tileX, Generator.Parameters.BONUS_JUMP_START_TILE, Generator.Parameters.BONUS_JUMP_END_TILE, Generator.Parameters.BONUS_JUMP_PROB_MIN, Generator.Parameters.BONUS_JUMP_PROB_MAX));
            // bonus jump count
            this._bonusJumpCount = Math.round(this.mapLinear(tileX, Generator.Parameters.BONUS_JUMP_COUNT_START_TILE, Generator.Parameters.BONUS_JUMP_COUNT_END_TILE, Generator.Parameters.BONUS_JUMP_COUNT_MIN, Generator.Parameters.BONUS_JUMP_COUNT_MAX));
        };
        // -------------------------------------------------------------------------
        Difficulty.prototype.toString = function () {
            return "platformLengthDecrease: " + this._platformLengthDecrease +
                ", jumpLengthDecrease: " + this._jumpLengthDecrease +
                ", spikesProbabilty: " + this._spikesProbability +
                ", bonusJumpProbability: " + this._bonusJumpProbability +
                ", bonusJumpCount: " + this._bonusJumpCount;
        };
        return Difficulty;
    }());
    Generator.Difficulty = Difficulty;
})(Generator || (Generator = {}));
var Generator;
(function (Generator_1) {
    var UNDEFINED = -10000;
    var Generator = /** @class */ (function () {
        // -------------------------------------------------------------------------
        function Generator(rnd) {
            // signals
            // dispatch new piece, previous piece
            this.onRandomPlatform = new Phaser.Signal();
            // dispatch new piece, previous piece, position in pattern, repeat order, pattern base piece
            this.onPatternPlatform = new Phaser.Signal();
            // dispatch new piece, previous piece, jump number
            this.onBonusJump = new Phaser.Signal();
            this._lastGeneratedPiece = null;
            // pieces queue
            this._piecesQueue = [];
            this._piecesQueueTop = 0;
            this._hlpPoint = new Phaser.Point();
            // random numbers generator
            this._rnd = rnd;
            // reference to jump tables
            this._jumpTables = Generator_1.JumpTables.instance;
            // pool of pieces
            this._piecesPool = new Helper.Pool(Generator_1.Piece, 16);
        }
        // -------------------------------------------------------------------------
        Generator.prototype.createPiece = function () {
            var piece = this._piecesPool.createItem();
            if (piece === null) {
                console.error("No free pieces in pool");
            }
            return piece;
        };
        // -------------------------------------------------------------------------
        Generator.prototype.destroyPiece = function (piece) {
            this._piecesPool.destroyItem(piece);
        };
        Object.defineProperty(Generator.prototype, "hasPieces", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._piecesQueueTop > 0;
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        Generator.prototype.addPieceIntoQueue = function (piece) {
            // put new piece into queue and increase its length
            this._piecesQueue[this._piecesQueueTop++] = piece;
        };
        // -------------------------------------------------------------------------
        Generator.prototype.getPieceFromQueue = function () {
            // if no pieces in queue then return null
            if (this._piecesQueueTop === 0) {
                return null;
            }
            // get first piece in queue
            var piece = this._piecesQueue[0];
            // shift remaining pieces left by 1
            for (var i = 0; i < this._piecesQueueTop - 1; i++) {
                this._piecesQueue[i] = this._piecesQueue[i + 1];
            }
            // clear last slot in queue and decrease queue top
            this._piecesQueue[--this._piecesQueueTop] = null;
            return piece;
        };
        // -------------------------------------------------------------------------
        Generator.prototype.setPiece = function (x, y, length, offsetX, offsetY) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            var piece = this.createPiece();
            piece.position.set(x, y);
            piece.offset.set(offsetX, offsetY);
            piece.length = length;
            this.addPieceIntoQueue(piece);
            return piece;
        };
        // -------------------------------------------------------------------------
        Generator.prototype.generate = function (lastPosition, difficulty, length, offsetX, offsetY, bonusJump) {
            var piece = this.createPiece();
            var ubound = Generator_1.Parameters.UBOUND;
            var lbound = Generator_1.Parameters.LBOUND;
            // Y POSITION
            // how high can jump max
            var minY = this._jumpTables.maxOffsetY();
            // how deep can fall max
            // let maxY = lbound - ubound;
            var maxY = -minY;
            // clear last y from upper bound, so it starts from 0
            var currentY = lastPosition.y - ubound;
            var shiftY = offsetY;
            if (shiftY === UNDEFINED) {
                // new random y position - each y level on screen has the same probability
                shiftY = this._rnd.integerInRange(0, lbound - ubound);
                // substract currentY from shiftY - it will split possible y levels to negative
                // (how much step up (-)) and positive (how much to step down (+))
                shiftY -= currentY;
                // clamp step to keep it inside interval given with maximum 
                // jump offset up (minY) and maximum fall down (maxX)
                shiftY = Phaser.Math.clamp(shiftY, minY, maxY);
            }
            // new level for platform
            // limit once more against game limits (2 free tiles on top, 1 water tile at bottom)
            var newY = Phaser.Math.clamp(currentY + shiftY, 0, lbound - ubound);
            // shift by upper bound to get right y level on screen
            piece.position.y = newY + ubound;
            // offset of new piece relative to last position (end position of last piece)
            piece.offset.y = piece.position.y - lastPosition.y;
            // X POSITION
            var shiftX = offsetX;
            // calculate is offsetX is not forced or offsetY was forced, but final value is different
            if (shiftX === UNDEFINED || (offsetY !== UNDEFINED && offsetY !== piece.offset.y)) {
                var minX = this._jumpTables.minOffsetX(piece.offset.y);
                var maxX = this._jumpTables.maxOffsetX(piece.offset.y);
                // if bonus jump or previous piece was bonus jump,
                // then make gap at least one cell width (if possible) (= offset 2)
                if (bonusJump || (this._lastGeneratedPiece !== null && this._lastGeneratedPiece.bonusJump)) {
                    minX = Math.min(Math.max(minX, 2), maxX);
                }
                // decrease maximum jump distance with jump decreaser in difficulty to
                // make jumps easier in the beginning of game
                // But be sure it does not fall under minX
                if (!bonusJump) {
                    maxX = Math.max(minX, maxX + difficulty.jumpLengthDecrease);
                }
                // position of next tile in x direction
                shiftX = this._rnd.integerInRange(minX, maxX);
            }
            // new absolute x position
            piece.position.x = lastPosition.x + shiftX;
            // offset of new piece relative to last position (end position of last piece)
            piece.offset.x = shiftX;
            // LENGTH
            if (length !== UNDEFINED) {
                piece.length = length;
            }
            else {
                // decrease maximum length of platform with difficulty progress
                piece.length = this._rnd.integerInRange(Generator_1.Parameters.PLATFORM_LENGTH_MIN, Generator_1.Parameters.PLATFORM_LENGTH_MAX + difficulty.platformLengthDecrease);
            }
            // SPIKES
            if (this._lastGeneratedPiece !== null && this._lastGeneratedPiece.spikesPattern === 0 &&
                !bonusJump &&
                (this._rnd.integerInRange(0, 99) < difficulty.spikesProbability)) {
                // adjust length - make piece longer
                piece.length = this._rnd.integerInRange(5, 9);
                // choose spikes pattern randomly
                var patternDefs = Generator_1.Parameters.SPIKE_PATTERNS[piece.length];
                piece.spikesPattern = patternDefs[this._rnd.integerInRange(0, patternDefs.length - 1)];
            }
            else {
                piece.spikesPattern = 0;
            }
            // BONUS JUMP
            piece.bonusJump = bonusJump;
            // console.log(difficulty.toString());
            // RESULT
            this._lastGeneratedPiece = piece;
            return piece;
        };
        // -------------------------------------------------------------------------
        Generator.prototype.generatePieces = function (lastTile, difficulty) {
            var probability = this._rnd.integerInRange(0, 99);
            if (probability < difficulty.bonusJumpProbability &&
                this._lastGeneratedPiece !== null && !this._lastGeneratedPiece.bonusJump) {
                this.generateBonusJump(lastTile, difficulty);
            }
            else {
                probability = this._rnd.integerInRange(0, 99);
                if (probability < Generator_1.Parameters.GENERATE_RANDOM) {
                    this.generateRandomly(lastTile, difficulty);
                }
                else {
                    this.generatePattern(lastTile, difficulty);
                }
            }
        };
        // -------------------------------------------------------------------------
        Generator.prototype.generateRandomly = function (lastTile, difficulty) {
            var prevPiece = this._lastGeneratedPiece;
            var piece = this.generate(lastTile, difficulty, UNDEFINED, UNDEFINED, UNDEFINED, false);
            // add to queue
            this.addPieceIntoQueue(piece);
            // dispatch signal - let listeners know, random platform has been generated
            // pass: new piece, previous piece
            this.onRandomPlatform.dispatch(piece, prevPiece);
        };
        // -------------------------------------------------------------------------
        Generator.prototype.generatePattern = function (lastTile, difficulty) {
            // save index of first new piece
            var oldQueueTop = this._piecesQueueTop;
            // where to start generating
            var hlpPos = this._hlpPoint;
            hlpPos.copyFrom(lastTile);
            // same length for all pices?
            var length = UNDEFINED;
            if (this._rnd.integerInRange(0, 99) < Generator_1.Parameters.KEEP_LENGTH_IN_PATTERN) {
                length = this._rnd.integerInRange(Generator_1.Parameters.PLATFORM_LENGTH_MIN, Generator_1.Parameters.PLATFORM_LENGTH_MAX + difficulty.platformLengthDecrease);
            }
            // how many pieces to repeat in pattern
            var basePices = 2;
            for (var i = 0; i < basePices; i++) {
                var prevPiece = this._lastGeneratedPiece;
                var piece = this.generate(hlpPos, difficulty, length, UNDEFINED, UNDEFINED, false);
                hlpPos.copyFrom(piece.position);
                // get last tile of piece
                hlpPos.x += piece.length - 1;
                // add to queue
                this.addPieceIntoQueue(piece);
                // dispatch signal - let listeners know, pattern platform has been generated
                // pass: new piece, previous piece, position in pattern, repeat order, pattern base piece
                this.onPatternPlatform.dispatch(piece, prevPiece, i, 0, null);
            }
            // repeat pattern X times
            var repeat = 1;
            for (var i = 0; i < repeat; i++) {
                // repeat all pieces in pattern
                for (var p = 0; p < basePices; p++) {
                    var prevPiece = this._lastGeneratedPiece;
                    // get first piece in pattern to repeat as template
                    var templetePiece = this._piecesQueue[oldQueueTop + p];
                    // replicate it
                    var piece = this.generate(hlpPos, difficulty, length, templetePiece.offset.x, templetePiece.offset.y, false);
                    hlpPos.copyFrom(piece.position);
                    hlpPos.x += piece.length - 1;
                    // add to stack
                    this.addPieceIntoQueue(piece);
                    // dispatch signal - let listeners know, pattern platform has been generated
                    // pass: new piece, previous piece, position in pattern, repeat order, pattern base piece
                    this.onPatternPlatform.dispatch(piece, prevPiece, p, i + 1, templetePiece);
                }
            }
        };
        // -------------------------------------------------------------------------
        Generator.prototype.generateBonusJump = function (lastTile, difficulty) {
            // random number of consecutive jump bonuses
            var jumps = this._rnd.integerInRange(Generator_1.Parameters.BONUS_JUMP_COUNT_MIN, difficulty.bonusJumpCount);
            var piece;
            var prevPiece = this._lastGeneratedPiece;
            for (var i = 0; i < jumps; i++) {
                // first jump in row of jumps?
                if (i === 0) {
                    piece = this.generate(lastTile, difficulty, 1, UNDEFINED, UNDEFINED, true);
                }
                else {
                    piece = this.generate(prevPiece.position, difficulty, 1, prevPiece.offset.x, prevPiece.offset.y, true);
                }
                // add to stack
                this.addPieceIntoQueue(piece);
                // dispatch signal
                this.onBonusJump.dispatch(piece, prevPiece, i);
                prevPiece = piece;
            }
        };
        return Generator;
    }());
    Generator_1.Generator = Generator;
})(Generator || (Generator = {}));
var Generator;
(function (Generator) {
    var Jump = /** @class */ (function () {
        function Jump() {
            this.offsetY = 0;
            this.offsetX = 0;
        }
        // -------------------------------------------------------------------------
        Jump.prototype.toString = function () {
            return "offsetX: " + this.offsetX + ", offsetY: " + this.offsetY;
        };
        return Jump;
    }());
    Generator.Jump = Jump;
})(Generator || (Generator = {}));
var Generator;
(function (Generator) {
    var JumpTables = /** @class */ (function () {
        // -------------------------------------------------------------------------
        function JumpTables() {
            // velocities
            this._jumpVelocities = [];
            // list of possible jumps for each jump velocity and position within cell
            this._jumpDefs = [];
            // results of jump table analysis
            this._jumpOffsetsY = [];
            this._jumpOffsetYMax = 0;
            this._jumpOffsetXMins = {};
            this._jumpOffsetXMaxs = {};
            this.calculateJumpVelocities();
            this.calculateJumpTables();
        }
        Object.defineProperty(JumpTables, "instance", {
            // -------------------------------------------------------------------------
            get: function () {
                if (JumpTables._instance === null) {
                    JumpTables._instance = new JumpTables();
                }
                return JumpTables._instance;
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        JumpTables.prototype.calculateJumpVelocities = function () {
            // all height samples
            for (var i = 0; i <= Generator.Parameters.HEIGHT_STEPS; i++) {
                // maximum height of jump for this step
                var height = Generator.Parameters.HEIGHT_MIN + (Generator.Parameters.HEIGHT_MAX - Generator.Parameters.HEIGHT_MIN) / Generator.Parameters.HEIGHT_STEPS * i;
                // v = sqrt(-(2 * s * g))
                this._jumpVelocities[i] = -Math.sqrt(2 * height * Generator.Parameters.GRAVITY);
            }
        };
        Object.defineProperty(JumpTables.prototype, "minJumpVelocity", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._jumpVelocities[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JumpTables.prototype, "maxJumpVelocity", {
            // -------------------------------------------------------------------------
            get: function () {
                return this._jumpVelocities[this._jumpVelocities.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        // ---------------------------- JUMP TABLES --------------------------------
        // -------------------------------------------------------------------------
        JumpTables.prototype.calculateJumpTables = function () {
            // all jump velocities
            for (var height = 0; height <= Generator.Parameters.HEIGHT_STEPS; height++) {
                this._jumpDefs[height] = [];
                // step from left to right on cell
                for (var step = 0; step < 1 /*Parameters.CELL_STEPS*/; step++) {
                    this.calculateJumpCurve(step, height);
                }
            }
            // analyze created jump tables
            this.analyzeJumpTables();
        };
        // -------------------------------------------------------------------------
        JumpTables.prototype.calculateJumpCurve = function (step, jumpIndex) {
            // simulation timestep
            var timeStep = 1 / 60;
            // take jump velocity we calculated previously
            var velocity = this._jumpVelocities[jumpIndex];
            // start at middle of first step to spread samples better over cell
            // x and y positions are in pixels
            var x = step * Generator.Parameters.CELL_SIZE / Generator.Parameters.CELL_STEPS
                + Generator.Parameters.CELL_SIZE / Generator.Parameters.CELL_STEPS / 2;
            var y = 0;
            // y position in cells coordinates (row within grid)
            var cellY = 0;
            // help variables to track previous position
            var prevX, prevY;
            // array of jumps from starting position to possible destinations
            var jumpDefs = [];
            // helper object that will help us keep track of visited cells
            var visitedList = {};
            // half of player body width
            var playerWidthHalf = Generator.Parameters.PLAYER_BODY_WIDTH / 2 * 0.5;
            // debug
            var debugBitmap = (JumpTables._DEBUG) ? JumpTables.debugBitmapData : null;
            // offset drawing of curve little bit down (by 4 cells),
            // otherwise it will be cut at top as we start jump at point [x, 0]
            var yOffset = Generator.Parameters.CELL_SIZE * 4;
            // simulate physics
            while (cellY < Generator.Parameters.GRID_HEIGHT) {
                // save previous position
                prevX = x;
                prevY = y;
                // adjust velocity
                velocity += Generator.Parameters.GRAVITY * timeStep;
                // new posiiton
                y += velocity * timeStep;
                x += Generator.Parameters.VELOCITY_X * timeStep;
                // draw path - small white dot
                if (JumpTables._DEBUG) {
                    debugBitmap.rect(x, y + yOffset, 2, 2, "#FFFFFF");
                }
                // left and right bottom point based on body width.
                var leftCell = void 0, rightCell = void 0;
                cellY = Math.floor(y / Generator.Parameters.CELL_SIZE);
                // falling down
                if (velocity > 0) {
                    // crossed cell border to next vertical cell?
                    if (cellY > Math.floor(prevY / Generator.Parameters.CELL_SIZE)) {
                        // calc as intersection of line from prev. position and current position with grid horizontal line
                        var pixelBorderY = Math.floor(y / Generator.Parameters.CELL_SIZE) * Generator.Parameters.CELL_SIZE;
                        var pixelBorderX = prevX + (x - prevX) * (pixelBorderY - prevY) / (y - prevY);
                        leftCell = Math.floor((pixelBorderX - playerWidthHalf) / Generator.Parameters.CELL_SIZE);
                        rightCell = Math.floor((pixelBorderX + playerWidthHalf) / Generator.Parameters.CELL_SIZE);
                        // all cells in x direction occupied with body
                        for (var i = leftCell; i <= rightCell; i++) {
                            var visitedId = i + (cellY << 8);
                            // if not already in list, then add new jump to reach this cell
                            if (typeof visitedList[visitedId] === "undefined") {
                                var jump = new Generator.Jump();
                                jump.offsetX = i;
                                jump.offsetY = cellY;
                                jumpDefs.push(jump);
                                //console.log(jump.toString());
                            }
                        }
                        // debug
                        if (JumpTables._DEBUG) {
                            // debug draw
                            var py = pixelBorderY + yOffset;
                            // line with original body width
                            var color = "#4040FF";
                            var pxLeft = pixelBorderX - Generator.Parameters.PLAYER_BODY_WIDTH / 2;
                            var pxRight = pixelBorderX + Generator.Parameters.PLAYER_BODY_WIDTH / 2;
                            debugBitmap.line(pxLeft, py, pxRight, py, color);
                            color = "#0000FF";
                            pxLeft = pixelBorderX - playerWidthHalf;
                            pxRight = pixelBorderX + playerWidthHalf;
                            // line with shortened body width
                            debugBitmap.line(pxLeft, py, pxRight, py, color);
                            debugBitmap.line(pxLeft, py - 3, pxLeft, py + 3, color);
                            debugBitmap.line(pxRight, py - 3, pxRight, py + 3, color);
                        }
                    }
                }
                leftCell = Math.floor((x - playerWidthHalf) / Generator.Parameters.CELL_SIZE);
                rightCell = Math.floor((x + playerWidthHalf) / Generator.Parameters.CELL_SIZE);
                // add grid cells to visited
                for (var i = leftCell; i <= rightCell; i++) {
                    // make "id"
                    var visitedId = i + (cellY << 8);
                    if (typeof visitedList[visitedId] === "undefined") {
                        visitedList[visitedId] = visitedId;
                    }
                }
            }
            this._jumpDefs[jumpIndex][step] = jumpDefs;
        };
        // -------------------------------------------------------------------------
        JumpTables.prototype.analyzeJumpTables = function () {
            // min y
            this._jumpOffsetYMax = 0;
            // through all jump velocities
            for (var velocity = 0; velocity < this._jumpDefs.length; velocity++) {
                // get only first x position within cell and first jump for given velocity,
                // because all have the same height
                this._jumpOffsetsY[velocity] = this._jumpDefs[velocity][0][0].offsetY;
                // check for maximum offset in y direction.
                // As it is negative number, we are looking for min in fact
                this._jumpOffsetYMax = Math.min(this._jumpOffsetYMax, this._jumpOffsetsY[velocity]);
            }
            // find minimum and maximum offset in cells to jump to at given height level
            for (var velocity = 1; velocity < this._jumpDefs.length; velocity++) {
                // get only first startX, because it has smallest x offset
                var jumps = this._jumpDefs[velocity][0];
                for (var j = 0; j < jumps.length; j++) {
                    var jump = jumps[j];
                    var currentMin = this._jumpOffsetXMins[jump.offsetY];
                    this._jumpOffsetXMins[jump.offsetY] = (typeof currentMin !== "undefined") ?
                        Math.min(currentMin, jump.offsetX) : jump.offsetX;
                    // console.log("LEVEL: " + jump.offsetY + " - jump from " + this.minOffsetX(jump.offsetY));
                }
                // get only last startX, because it has biggest x offset
                jumps = this._jumpDefs[velocity][this._jumpDefs[velocity].length - 1];
                for (var j = 0; j < jumps.length; j++) {
                    var jump = jumps[j];
                    var currentMax = this._jumpOffsetXMaxs[jump.offsetY];
                    this._jumpOffsetXMaxs[jump.offsetY] = (typeof currentMax !== "undefined") ?
                        Math.max(currentMax, jump.offsetX) : jump.offsetX;
                    // console.log("LEVEL: " + jump.offsetY + " - jump to " + this.maxOffsetX(jump.offsetY));
                }
            }
        };
        // -------------------------------------------------------------------------
        JumpTables.prototype.maxOffsetY = function (jumpIndex) {
            if (jumpIndex === void 0) { jumpIndex = -1; }
            if (jumpIndex === -1) {
                return this._jumpOffsetYMax;
            }
            else {
                return this._jumpOffsetsY[jumpIndex];
            }
        };
        // -------------------------------------------------------------------------
        JumpTables.prototype.maxOffsetX = function (offsetY) {
            var maxX = this._jumpOffsetXMaxs[offsetY];
            if (typeof maxX === "undefined") {
                console.error("max X for offset y = " + offsetY + " does not exist");
                maxX = 0;
            }
            return maxX;
        };
        // -------------------------------------------------------------------------
        JumpTables.prototype.minOffsetX = function (offsetY) {
            var minX = this._jumpOffsetXMins[offsetY];
            if (typeof minX === "undefined") {
                console.error("min X for offset y = " + offsetY + " does not exist");
                minX = 0;
            }
            return minX;
        };
        // -------------------------------------------------------------------------
        JumpTables.setDebug = function (debug, gameGlobals) {
            JumpTables._DEBUG = debug;
            JumpTables._globals = gameGlobals;
            if (debug) {
                if (typeof gameGlobals === "undefined" || gameGlobals === null) {
                    console.warn("No game globals provided - switching debug off");
                    JumpTables._DEBUG = false;
                }
                else {
                    JumpTables.createDebugBitmap();
                }
            }
        };
        Object.defineProperty(JumpTables, "debugBitmapData", {
            // -------------------------------------------------------------------------
            get: function () {
                return JumpTables._debugBmd;
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        JumpTables.createDebugBitmap = function () {
            var global = JumpTables._globals;
            var bmd = new Phaser.BitmapData(global.game, "Grid", global.GAME_WIDTH, global.GAME_HEIGHT);
            bmd.fill(192, 192, 192);
            // horizontal lines
            for (var i = 0; i < global.GAME_HEIGHT; i += Generator.Parameters.CELL_SIZE) {
                bmd.line(0, i + 0.5, global.GAME_WIDTH - 1, i + 0.5);
            }
            // vertical lines
            for (var i = 0; i < global.GAME_WIDTH; i += Generator.Parameters.CELL_SIZE) {
                bmd.line(i + 0.5, 0, i + 0.5, global.GAME_HEIGHT - 1);
                // add columns header numbers
                bmd.text("" + (i / Generator.Parameters.CELL_SIZE), i + 20, 20, "24px Courier", "#FFFF00");
            }
            JumpTables._debugBmd = bmd;
        };
        JumpTables._instance = null;
        // -------------------------------------------------------------------------
        // ------------------------------ DEBUG ------------------------------------
        // -------------------------------------------------------------------------
        JumpTables._DEBUG = false;
        return JumpTables;
    }());
    Generator.JumpTables = JumpTables;
})(Generator || (Generator = {}));
var Generator;
(function (Generator) {
    var Parameters = /** @class */ (function () {
        function Parameters() {
        }
        Parameters.FORCE_TAP = false;
        // grid
        Parameters.GRID_HEIGHT = 10;
        Parameters.CELL_SIZE = 64;
        Parameters.CELL_STEPS = 4;
        // gravity
        Parameters.GRAVITY = 2400;
        // player body dimensions
        Parameters.PLAYER_BODY_WIDTH = 30;
        Parameters.PLAYER_BODY_HEIGHT = 90;
        // jump height params
        Parameters.HEIGHT_MIN = Parameters.CELL_SIZE * 0.75;
        Parameters.HEIGHT_MAX = Parameters.CELL_SIZE * 2.90;
        Parameters.HEIGHT_STEPS = 4;
        // horizontal speed
        Parameters.VELOCITY_X = 300;
        // bounds for generating platforms
        Parameters.UBOUND = 2;
        Parameters.LBOUND = 8;
        // --- GENERATOR ---
        // probability to generate random piece in percent
        Parameters.GENERATE_RANDOM = 50;
        // keep length of all platforms in pattern the same? (in percent)
        Parameters.KEEP_LENGTH_IN_PATTERN = 75;
        // --- DIFFICULTY ---
        // platform length
        Parameters.PLATFORM_LENGTH_MIN = 2;
        Parameters.PLATFORM_LENGTH_MAX = 5;
        Parameters.PLATFORM_LENGTH_DECREASER_MIN = 0;
        Parameters.PLATFORM_LENGTH_DECREASER_MAX = -2;
        Parameters.PLATFORM_LENGTH_DECREASER_START_TILE = 100;
        Parameters.PLATFORM_LENGTH_DECREASER_END_TILE = 200;
        // jump length
        Parameters.JUMP_LENGTH_DECREASER_MIN = -1;
        Parameters.JUMP_LENGTH_DECREASER_MAX = 0;
        Parameters.JUMP_LENGTH_DECREASER_START_TILE = 0;
        Parameters.JUMP_LENGTH_DECREASER_END_TILE = 50;
        // spikes
        Parameters.SPIKES_PROB_MIN = 0;
        Parameters.SPIKES_PROB_MAX = 25;
        Parameters.SPIKES_PROB_START_TILE = 30;
        Parameters.SPIKES_PROB_END_TILE = 80;
        // bonus jump probability
        Parameters.BONUS_JUMP_PROB_MIN = 0;
        Parameters.BONUS_JUMP_PROB_MAX = 30;
        Parameters.BONUS_JUMP_START_TILE = 50;
        Parameters.BONUS_JUMP_END_TILE = 200;
        // bonus jump count
        Parameters.BONUS_JUMP_COUNT_MIN = 1;
        Parameters.BONUS_JUMP_COUNT_MAX = 3;
        Parameters.BONUS_JUMP_COUNT_START_TILE = 50;
        Parameters.BONUS_JUMP_COUNT_END_TILE = 300;
        //// --- SPIKE PATTERNS ---
        //public static SPIKE_PATTERNS: number[][] = [
        //    [],                                     // 0
        //    [],                                     // 1
        //    [],                                     // 2
        //    [],                                     // 3
        //    [],                                     // 4
        //    [0b00100],                              // 5
        //    [0b001100],                             // 6
        //    [0b0011100, 0b0010100],                 // 7
        //    [0b00011000, 0b00100100],               // 8
        //    [0b000111000, 0b001101100, 0b001000100] // 9
        //];
        // --- SPIKE PATTERNS ---
        Parameters.SPIKE_PATTERNS = [
            [],
            [],
            [],
            [],
            [],
            // 00 00 11 00 00
            [48],
            // 00 00 11 11 00 00
            [240],
            // 00 00 01 01 00 00 00, 00 00 10 00 01 00 00
            [320, 528],
            // 00 00 00 11 11 00 00 00, 00 00 11 00 00 11 00 00
            [960, 3120],
            // 00 00 00 01 01 00 00 00 00, 00 00 10 10 00 01 01 00 00, 00 00 11 00 00 00 11 00 00
            [1280, 10320, 12336] // 9
        ];
        return Parameters;
    }());
    Generator.Parameters = Parameters;
})(Generator || (Generator = {}));
var Generator;
(function (Generator) {
    var Piece = /** @class */ (function () {
        function Piece() {
            // absolute position of left cell / tile
            this.position = new Phaser.Point(0, 0);
            // offset from end of previous piece
            this.offset = new Phaser.Point(0, 0);
        }
        return Piece;
    }());
    Generator.Piece = Piece;
})(Generator || (Generator = {}));
var Helper;
(function (Helper) {
    var NineImage = /** @class */ (function () {
        function NineImage() {
        }
        // -------------------------------------------------------------------------
        NineImage.create = function (aGame, aWidth, aHeight, aKey, aFrame, aTop, aLeft, aBottom, aRight, aRepeats) {
            if (aTop === void 0) { aTop = 0; }
            if (aLeft === void 0) { aLeft = 0; }
            if (aBottom === void 0) { aBottom = 0; }
            if (aRight === void 0) { aRight = 0; }
            if (aRepeats === void 0) { aRepeats = false; }
            // image
            var source = new Phaser.Image(aGame, 0, 0, aKey, aFrame);
            // get frame
            var frame;
            if (typeof aFrame === "string") {
                frame = aGame.cache.getFrameByName(aKey, aFrame);
            }
            else {
                frame = aGame.cache.getFrameByIndex(aKey, aFrame);
            }
            // calculate dims
            NineImage.calculateNineImage(frame, aWidth, aHeight, aTop, aLeft, aBottom, aRight, aRepeats);
            // create nine image bitmap data
            NineImage._nineImage = new Phaser.BitmapData(aGame, "NineImage" + (NineImage._textureKey++), NineImage._width, NineImage._height);
            // render into bitmap data
            NineImage.renderNineImage(source);
            // return result
            return NineImage._nineImage;
        };
        // -------------------------------------------------------------------------
        NineImage.calculateNineImage = function (aFrame, aWidth, aHeight, aTop, aLeft, aBottom, aRight, aRepeats) {
            NineImage._centralWidth = aFrame.width - aLeft - aRight;
            NineImage._centralHeight = aFrame.height - aTop - aBottom;
            if (aRepeats) {
                NineImage._horizontalRepeats = aWidth;
                NineImage._verticalRepeats = aHeight;
                NineImage._width = aLeft + aRight + NineImage._centralWidth * aWidth;
                NineImage._height = aTop + aBottom + NineImage._centralHeight * aHeight;
                NineImage._lastWidth = 0;
                NineImage._lastHeight = 0;
            }
            else {
                var w = aWidth - aLeft - aRight;
                NineImage._horizontalRepeats = Math.floor(w / NineImage._centralWidth);
                NineImage._lastWidth = w % NineImage._centralWidth;
                var h = aHeight - aTop - aBottom;
                NineImage._verticalRepeats = Math.floor(h / NineImage._centralHeight);
                NineImage._lastHeight = h % NineImage._centralHeight;
                NineImage._width = aWidth;
                NineImage._height = aHeight;
            }
            NineImage._leftWidth = aLeft;
            NineImage._rightWidth = aRight;
            NineImage._topHeight = aTop;
            NineImage._bottomHeight = aBottom;
        };
        // -------------------------------------------------------------------------
        NineImage.renderNineImage = function (aSource) {
            var sourceY = 0; //NineImage._frame.y;
            var destY = 0;
            // top row
            if (NineImage._topHeight > 0) {
                NineImage.renderNineImageRow(aSource, sourceY, destY, NineImage._topHeight);
                sourceY += NineImage._topHeight;
                destY += NineImage._topHeight;
            }
            // centrals
            for (var i = 0; i < NineImage._verticalRepeats; i++) {
                NineImage.renderNineImageRow(aSource, sourceY, destY, NineImage._centralHeight);
                destY += NineImage._centralHeight;
            }
            // last height
            if (NineImage._lastHeight > 0) {
                NineImage.renderNineImageRow(aSource, sourceY, destY, NineImage._lastHeight);
                destY += NineImage._lastHeight;
            }
            sourceY += NineImage._centralHeight;
            // bottom
            if (NineImage._bottomHeight > 0) {
                NineImage.renderNineImageRow(aSource, sourceY, destY, NineImage._bottomHeight);
            }
        };
        // -------------------------------------------------------------------------
        NineImage.renderNineImageRow = function (aImage, aSourceY, aDestY, aHeight) {
            var sourceX = 0; //NineImage._frame.x;
            var destX = 0;
            // left
            if (NineImage._leftWidth > 0) {
                NineImage._nineImage.copy(aImage, sourceX, aSourceY, NineImage._leftWidth, aHeight, destX, aDestY);
                destX += NineImage._leftWidth;
                sourceX += NineImage._leftWidth;
            }
            // centrals
            for (var i = 0; i < NineImage._horizontalRepeats; i++) {
                NineImage._nineImage.copy(aImage, sourceX, aSourceY, NineImage._centralWidth, aHeight, destX, aDestY);
                destX += NineImage._centralWidth;
            }
            // last width
            if (NineImage._lastWidth > 0) {
                NineImage._nineImage.copy(aImage, sourceX, aSourceY, NineImage._lastWidth, aHeight, destX, aDestY);
                destX += NineImage._lastWidth;
            }
            sourceX += NineImage._centralWidth;
            // right
            if (NineImage._rightWidth > 0) {
                NineImage._nineImage.copy(aImage, sourceX, aSourceY, NineImage._rightWidth, aHeight, destX, aDestY);
            }
        };
        NineImage._textureKey = 0;
        return NineImage;
    }());
    Helper.NineImage = NineImage;
})(Helper || (Helper = {}));
var Helper;
(function (Helper) {
    var Pool = /** @class */ (function () {
        // -------------------------------------------------------------------------
        function Pool(classType, count, newFunction) {
            if (newFunction === void 0) { newFunction = null; }
            this._newFunction = null;
            this._count = 0;
            this._pool = [];
            this._canGrow = true;
            this._poolSize = 0;
            this._classType = classType;
            this._newFunction = newFunction;
            for (var i = 0; i < count; i++) {
                // create new item
                var item = this.newItem();
                // store into stack of free items
                this._pool[this._count++] = item;
            }
        }
        // -------------------------------------------------------------------------
        Pool.prototype.createItem = function () {
            if (this._count === 0) {
                return this._canGrow ? this.newItem() : null;
            }
            else {
                return this._pool[--this._count];
            }
        };
        // -------------------------------------------------------------------------
        Pool.prototype.destroyItem = function (item) {
            this._pool[this._count++] = item;
        };
        // -------------------------------------------------------------------------
        Pool.prototype.newItem = function () {
            ++this._poolSize;
            if (this._newFunction !== null) {
                return this._newFunction();
            }
            else {
                return new this._classType;
            }
        };
        Object.defineProperty(Pool.prototype, "newFunction", {
            // -------------------------------------------------------------------------
            set: function (newFunction) {
                this._newFunction = newFunction;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "canGrow", {
            // -------------------------------------------------------------------------
            set: function (canGrow) {
                this._canGrow = canGrow;
            },
            enumerable: true,
            configurable: true
        });
        return Pool;
    }());
    Helper.Pool = Pool;
})(Helper || (Helper = {}));
var Helper;
(function (Helper) {
    var eCharType;
    (function (eCharType) {
        eCharType[eCharType["UNDEFINED"] = -1] = "UNDEFINED";
        eCharType[eCharType["SPACE"] = 1] = "SPACE";
        eCharType[eCharType["NEWLINE"] = 2] = "NEWLINE";
        eCharType[eCharType["CHARACTER"] = 3] = "CHARACTER";
        //SPECIAL = 4 // for future
    })(eCharType || (eCharType = {}));
    var TextWrapper = /** @class */ (function () {
        function TextWrapper() {
        }
        // -------------------------------------------------------------------------
        TextWrapper.hasNext = function () {
            return TextWrapper.textPosition < TextWrapper.text.length;
        };
        // -------------------------------------------------------------------------
        TextWrapper.getChar = function () {
            return TextWrapper.text.charAt(TextWrapper.textPosition++);
        };
        // -------------------------------------------------------------------------
        TextWrapper.peekChar = function () {
            return TextWrapper.text.charAt(TextWrapper.textPosition);
        };
        // -------------------------------------------------------------------------
        TextWrapper.getPosition = function () {
            return TextWrapper.textPosition;
        };
        // -------------------------------------------------------------------------
        TextWrapper.setPosition = function (aPosition) {
            TextWrapper.textPosition = aPosition;
        };
        // -------------------------------------------------------------------------
        TextWrapper.getCharAdvance = function (aCharCode, aPrevCharCode) {
            var charData = TextWrapper.fontData.chars[aCharCode];
            if (typeof charData === "undefined") {
                console.log("char " + aCharCode + " (" + String.fromCharCode(aCharCode) + ") not defined");
                return 1;
            }
            // width
            var advance = charData.xAdvance;
            // kerning
            if (aPrevCharCode > 0 && charData.kerning[aPrevCharCode])
                advance += charData.kerning[aPrevCharCode];
            return advance;
        };
        // -------------------------------------------------------------------------
        TextWrapper.getCharType = function (aChar) {
            if (aChar === ' ')
                return eCharType.SPACE;
            else if (/(?:\r\n|\r|\n)/.test(aChar))
                return eCharType.NEWLINE;
            else
                return eCharType.CHARACTER;
        };
        // -------------------------------------------------------------------------
        TextWrapper.wrapText = function (aGame, aText, aWidth, aHeight, aFontName, aSize) {
            // set vars for text processing
            TextWrapper.text = aText;
            TextWrapper.setPosition(0);
            // font data
            TextWrapper.fontData = aGame.cache.getBitmapFont(aFontName)["font"]; // Phaser.BitmapText.fonts[aFontName];
            // if size not defined then take default size
            if (aSize === undefined)
                aSize = TextWrapper.fontData.size;
            var scale = aSize / TextWrapper.fontData.size;
            // height of line scaled
            var lineHeight = TextWrapper.fontData.lineHeight * scale;
            // instead of scaling every single character we will scale line in opposite direction
            var lineWidth = aWidth / scale;
            // result
            var mLineStart = [];
            var mLineChars = [];
            var mPageStart = [];
            var mMaxLine = 0;
            var firstLineOnPage = true;
            var pageCounter = 0;
            // char position in text
            var currentPosition = 0;
            // first line position
            mLineStart[mMaxLine] = currentPosition;
            // first page
            mPageStart[pageCounter++] = 0;
            // remaining height of current page
            var remainingHeight = aHeight;
            // single line
            while (TextWrapper.hasNext()) {
                var charCount = 0;
                // saves number of chars before last space
                var saveSpaceCharCount = 0;
                var saveCharPosition = -1;
                // (previous) type of SBC character
                var type = eCharType.UNDEFINED;
                var previousType = eCharType.UNDEFINED;
                // remaining width will decrease with words read
                var remainingWidth = lineWidth;
                // previous char code
                var prevCharCode = -1;
                while (TextWrapper.hasNext()) {
                    currentPosition = TextWrapper.getPosition();
                    // read char and move in text by 1 character forward
                    var character = TextWrapper.getChar();
                    // get type and code
                    type = TextWrapper.getCharType(character);
                    var charCode = character.charCodeAt(0);
                    // process based on type
                    if (type === eCharType.SPACE) {
                        if (previousType !== eCharType.SPACE)
                            saveSpaceCharCount = charCount;
                        ++charCount;
                        remainingWidth -= TextWrapper.getCharAdvance(charCode, prevCharCode);
                    }
                    else if (type === eCharType.CHARACTER) {
                        if (previousType !== eCharType.CHARACTER)
                            saveCharPosition = currentPosition;
                        remainingWidth -= TextWrapper.getCharAdvance(charCode, prevCharCode);
                        if (remainingWidth < 0)
                            break;
                        ++charCount;
                    }
                    else if (type === eCharType.NEWLINE) {
                        var breakLoop = false;
                        // if there is no more text then ignore new line
                        if (TextWrapper.hasNext()) {
                            breakLoop = true;
                            saveSpaceCharCount = charCount;
                            saveCharPosition = TextWrapper.getPosition();
                            currentPosition = saveCharPosition;
                            // simulate normal width overflow
                            remainingWidth = -1;
                            type = eCharType.CHARACTER;
                        }
                        if (breakLoop)
                            break;
                    }
                    previousType = type;
                    prevCharCode = charCode;
                }
                // lines / pages
                remainingHeight -= lineHeight;
                // set new page if not enough remaining height
                if (remainingHeight < 0)
                    mPageStart[pageCounter++] = mMaxLine;
                if (remainingWidth < 0 && type === eCharType.CHARACTER) {
                    if (saveSpaceCharCount !== 0)
                        mLineChars[mMaxLine] = saveSpaceCharCount;
                    else
                        mLineChars[mMaxLine] = charCount;
                    // does new line still fits into current page?
                    firstLineOnPage = false;
                    // set new page
                    if (remainingHeight < 0) {
                        firstLineOnPage = true;
                        remainingHeight = aHeight - lineHeight;
                    }
                    if (saveSpaceCharCount !== 0) {
                        mLineStart[++mMaxLine] = saveCharPosition;
                        TextWrapper.setPosition(saveCharPosition);
                    }
                    else {
                        mLineStart[++mMaxLine] = currentPosition;
                        TextWrapper.setPosition(currentPosition);
                    }
                }
                else if (!TextWrapper.hasNext()) {
                    if (type === eCharType.CHARACTER) {
                        mLineChars[mMaxLine] = charCount;
                    }
                    else if (type === eCharType.SPACE) {
                        mLineChars[mMaxLine] = saveSpaceCharCount;
                    }
                }
            }
            mPageStart[pageCounter] = mMaxLine + 1;
            // lines into string[]
            var result = [];
            for (var i = 1; i <= pageCounter; i++) {
                var firstLine = mPageStart[i - 1];
                var lastLine = mPageStart[i];
                var pageText = [];
                for (var l = firstLine; l < lastLine; l++) {
                    pageText.push(TextWrapper.text.substr(mLineStart[l], mLineChars[l]));
                }
                result.push(pageText.join("\n"));
            }
            return result;
        };
        return TextWrapper;
    }());
    Helper.TextWrapper = TextWrapper;
})(Helper || (Helper = {}));
var GoblinRun;
(function (GoblinRun) {
    var About = /** @class */ (function (_super) {
        __extends(About, _super);
        // -------------------------------------------------------------------------
        function About(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            // bg
            var aboutBg = Helper.NineImage.create(game, About.WIDTH, About.HEIGHT, "Sprites", "About", 32, 32, 32, 32, false);
            var about = game.add.sprite(0, 0, aboutBg, 0, _this);
            about.anchor.set(0.5, 0.5);
            // text
            var txt = Helper.TextWrapper.wrapText(game, GoblinRun.Global.CREDITS_TEXT, About.WIDTH - About.BORDER * 2, 1000, "Alphabet", 24);
            var question = new Phaser.BitmapText(game, -About.WIDTH / 2 + About.BORDER, -About.HEIGHT / 2 + About.BORDER, "Alphabet", txt[0], 24);
            question.tint = 0x2B4940;
            _this.add(question);
            return _this;
        }
        About.WIDTH = 500;
        About.HEIGHT = 370;
        About.BORDER = 40;
        return About;
    }(Phaser.Group));
    GoblinRun.About = About;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var HiScore = /** @class */ (function (_super) {
        __extends(HiScore, _super);
        // -------------------------------------------------------------------------
        function HiScore(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            // icon
            _this._icon = new Phaser.Sprite(game, 0, 0, "Sprites", "Trophy");
            _this._icon.anchor.set(0, 0.5);
            _this.add(_this._icon);
            // text
            _this._text = new Phaser.BitmapText(game, Math.floor(_this._icon.width * 1.5), 0, "Font", "0", 35, "left");
            _this._text.anchor.y = 0.5;
            _this.add(_this._text);
            _this.center();
            return _this;
        }
        Object.defineProperty(HiScore.prototype, "score", {
            // -------------------------------------------------------------------------
            set: function (score) {
                this._text.text = "" + score;
                this.center();
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        HiScore.prototype.center = function () {
            var iconWidth = Math.floor(this._icon.width * 1.5);
            var x = -Math.floor((iconWidth + this._text.textWidth) / 2);
            this._icon.position.x = x;
            x += iconWidth;
            this._text.position.x = x;
        };
        return HiScore;
    }(Phaser.Group));
    GoblinRun.HiScore = HiScore;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Result = /** @class */ (function (_super) {
        __extends(Result, _super);
        // -------------------------------------------------------------------------
        function Result(game, parent) {
            var _this = _super.call(this, game, parent) || this;
            // bg
            var aboutBg = Helper.NineImage.create(game, Result.WIDTH, Result.HEIGHT, "Sprites", "About", 32, 32, 32, 32, false);
            var about = game.add.sprite(0, 0, aboutBg, 0, _this);
            about.anchor.set(0.5, 0.5);
            //// character
            //this._spriterGroup = new Spriter.SpriterGroup(this.game, Animations.PLAYER_ANIM, "Sprites", "Goblin", "girl");
            ////this._spriterGroup.visible = false;
            //this._spriterGroup.position.set(140, -Result.HEIGHT / 2);
            //this.add(this._spriterGroup);
            // score icon
            var y = -Result.HEIGHT / 2 - 40;
            _this._scoreIcon = game.add.sprite(0, y, "Sprites", "GoldUI_big", _this);
            _this._scoreIcon.anchor.x = 0.5;
            // distance
            y += 155;
            var lx = -Result.WIDTH / 2 + 40;
            var rx = -lx;
            // icon
            _this._distanceIcon = game.add.sprite(lx, y, "Sprites", "Distance", _this);
            _this._distanceIcon.anchor.set(0, 0.5);
            // text
            _this._distanceScore = new Phaser.BitmapText(game, rx, y, "Font", "0", 40, "right");
            _this._distanceScore.anchor.set(1, 0.5);
            _this.add(_this._distanceScore);
            // gold
            y += 65;
            // icon
            _this._goldIcon = game.add.sprite(lx, y, "Sprites", "Gold2", _this);
            _this._goldIcon.anchor.set(0, 0.5);
            // text
            _this._goldScore = new Phaser.BitmapText(game, rx, y, "Font", "0", 40, "right");
            _this._goldScore.anchor.set(1, 0.5);
            _this.add(_this._goldScore);
            // split line
            y += 50;
            var splitLine = game.add.sprite(0, y, "Sprites", "SplitLine", _this);
            splitLine.anchor.x = 0.5;
            splitLine.width = Result.WIDTH - 2 * 20;
            // total
            y += 50;
            // icon
            _this._totalIcon = game.add.sprite(lx + 10, y, "Sprites", "GoldUI", _this);
            _this._totalIcon.anchor.set(0, 0.5);
            // text
            _this._totalScore = new Phaser.BitmapText(game, rx, y, "Font", "0", 40, "right");
            _this._totalScore.anchor.set(1, 0.5);
            _this.add(_this._totalScore);
            // hiscore
            _this._hiScore = new GoblinRun.HiScore(game, _this);
            _this._hiScore.position.set(0, Result.HEIGHT / 2 - 50);
            return _this;
        }
        // -------------------------------------------------------------------------
        Result.prototype.init = function (distance, gold, hiScore) {
            this._distanceScore.text = "" + distance;
            this._goldScore.text = gold + " x " + GoblinRun.Play.SCORE_FOR_GOLD;
            this._totalScore.text = "" + (distance + gold * GoblinRun.Play.SCORE_FOR_GOLD);
            this._hiScore.score = hiScore;
        };
        // -------------------------------------------------------------------------
        Result.prototype.characterOn = function (on) {
            //this._spriterGroup.visible = on;
            //if (on) {
            //    this._spriterGroup.playAnimationByName("girl");
            //}
        };
        Result.WIDTH = 350;
        Result.HEIGHT = 420;
        return Result;
    }(Phaser.Group));
    GoblinRun.Result = Result;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Preferences = /** @class */ (function () {
        function Preferences() {
            this.record = 0;
            this.hiscore = 0;
            this.sound = true;
            this.tutorial = true;
        }
        Object.defineProperty(Preferences, "instance", {
            // -------------------------------------------------------------------------
            get: function () {
                if (Preferences._instance === null) {
                    Preferences._instance = new Preferences();
                }
                return Preferences._instance;
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        Preferences.prototype.load = function () {
            if (this.localStorageSupported()) {
                var dataString = localStorage.getItem("goblinrun_save");
                // no saved data?
                if (dataString === null || dataString === undefined) {
                    console.log("No saved settings");
                    return;
                }
                else {
                    console.log("loading settings: " + dataString);
                    // fill settings with data from loaded object
                    var data = JSON.parse(dataString);
                    // record
                    this.record = data.record;
                    // hiscore
                    this.hiscore = data.hiscore;
                    // sound
                    this.sound = data.sound;
                    // tutorial
                    this.tutorial = data.tutorial;
                }
            }
        };
        // -------------------------------------------------------------------------
        Preferences.prototype.save = function () {
            if (this.localStorageSupported()) {
                var dataString = JSON.stringify(this);
                console.log("saving settings: " + dataString);
                localStorage.setItem("goblinrun_save", dataString);
            }
        };
        // -------------------------------------------------------------------------
        Preferences.prototype.localStorageSupported = function () {
            try {
                return "localStorage" in window && window["localStorage"] !== null;
            }
            catch (e) {
                return false;
            }
        };
        Preferences._instance = null;
        return Preferences;
    }());
    GoblinRun.Preferences = Preferences;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Sounds = /** @class */ (function () {
        function Sounds() {
        }
        // definition of markers for sfx
        Sounds.AUDIO_JSON = {
            "resources": [
                "assets\\Sfx.ogg",
                "assets\\Sfx.m4a"
            ],
            "spritemap": {
                "end": {
                    "start": 0,
                    "end": 1.2299319727891156,
                    "loop": false
                },
                "bonus_jump": {
                    "start": 3,
                    "end": 3.225736961451247,
                    "loop": false
                },
                "gold": {
                    "start": 5,
                    "end": 5.395873015873016,
                    "loop": false
                },
                "hit": {
                    "start": 7,
                    "end": 7.09859410430839,
                    "loop": false
                },
                "jump": {
                    "start": 9,
                    "end": 9.184943310657596,
                    "loop": false
                },
                "land": {
                    "start": 11,
                    "end": 11.123083900226757,
                    "loop": false
                },
                "mud_fall": {
                    "start": 13,
                    "end": 13.482630385487528,
                    "loop": false
                },
                "select": {
                    "start": 15,
                    "end": 15.052879818594104,
                    "loop": false
                }
            }
        };
        return Sounds;
    }());
    GoblinRun.Sounds = Sounds;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    ;
    var Sponsors = /** @class */ (function () {
        function Sponsors() {
        }
        Sponsors.SPONSORS = {
            none: {
                id: 0 /* NONE */,
                sdk: null
            },
            sbcgames: {
                id: 1 /* SBCGAMES */,
                sdk: null
            },
            cloudgames: {
                id: 2 /* CLOUDGAMES */,
                sdk: null
            },
            gamearter: {
                id: 3 /* GAMEARTER */,
                sdk: null
            },
            wkb: {
                id: 4 /* WKB */,
                sdk: null
            }
        };
        return Sponsors;
    }());
    GoblinRun.Sponsors = Sponsors;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Boot = /** @class */ (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._userScale = new Phaser.Point(1, 1);
            _this._gameDims = new Phaser.Point();
            return _this;
        }
        // -------------------------------------------------------------------------
        Boot.prototype.init = function () {
            this.calcGameDims();
            this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.scale.setUserScale(this._userScale.x, this._userScale.y);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setResizeCallback(this.gameResized, this);
            if (!this.game.device.desktop) {
                this.scale.forceOrientation(true, false);
                this.scale.onOrientationChange.add(this.orientationChange, this);
            }
            if (this.game.device.chrome) {
                this.game.input.mspointer.stop();
            }
        };
        // -------------------------------------------------------------------------
        Boot.prototype.preload = function () {
            // font
            this.load.bitmapFont("Font", "assets/Font.png", "assets/Font.xml");
        };
        // -------------------------------------------------------------------------
        Boot.prototype.create = function () {
            this.game.state.start("Preload");
        };
        // -------------------------------------------------------------------------
        Boot.prototype.calcGameDims = function () {
            var winWidth = window.innerWidth;
            var winHeight = window.innerHeight;
            // calculate scale y. Size after scale is truncated (scaleY * game height).
            // Add small amount to height so scale is bigger for very small amount and we do not loose
            // 1px line because of number precision
            var scaleY = (winHeight + 0.01) / GoblinRun.Global.GAME_HEIGHT;
            // get game width with dividing window width with scale y (we want scale y
            // to be equal to scale x to aviod stretching). Then adjust scale x in the same way as scale y
            var gameWidth = Math.round(winWidth / (winHeight / GoblinRun.Global.GAME_HEIGHT));
            var scaleX = (winWidth + 0.01) / gameWidth;
            // save new values
            this._userScale.set(scaleY, scaleX);
            this._gameDims.set(gameWidth, GoblinRun.Global.GAME_HEIGHT);
        };
        // -------------------------------------------------------------------------
        Boot.prototype.gameResized = function (scaleManger, bounds) {
            if (!scaleManger.incorrectOrientation) {
                this.time.events.add(200, function () {
                    var oldScaleX = this._userScale.x;
                    var oldScaleY = this._userScale.y;
                    // recalculate game dims
                    this.calcGameDims();
                    var dims = this._gameDims;
                    var scale = this._userScale;
                    // any change in game size or in scale?
                    if (dims.x !== this.game.width || dims.y !== this.game.height ||
                        Math.abs(scale.x - oldScaleX) > 0.001 || Math.abs(scale.y - oldScaleY) > 0.001) {
                        // set new game size and new scale parameters
                        this.scale.setGameSize(dims.x, dims.y);
                        this.scale.setUserScale(scale.x, scale.y);
                        // has current state onResize method? If yes call it.
                        var currentState = this.game.state.getCurrentState();
                        if (typeof currentState.onResize === "function") {
                            currentState.onResize(dims.x, dims.y);
                        }
                    }
                }, this);
            }
        };
        // -------------------------------------------------------------------------
        Boot.prototype.orientationChange = function (scaleManger, previousOrientation, previouslyIncorrect) {
            if (scaleManger.isLandscape) {
                this.leaveIncorrectOrientation();
            }
            else {
                this.enterIncorrectOrientation();
            }
        };
        // -------------------------------------------------------------------------
        Boot.prototype.enterIncorrectOrientation = function () {
            // show change orientation image
            document.getElementById("orientation").style.display = "block";
            // if current state has onPause method then call it.
            var currentState = this.game.state.getCurrentState();
            if (typeof currentState.onPause === "function") {
                currentState.onPause();
            }
        };
        // -------------------------------------------------------------------------
        Boot.prototype.leaveIncorrectOrientation = function () {
            // hide change orientation image
            document.getElementById("orientation").style.display = "none";
            // if current state has onResume method then call it.
            var currentState = this.game.state.getCurrentState();
            if (typeof currentState.onResume === "function") {
                currentState.onResume();
            }
        };
        return Boot;
    }(Phaser.State));
    GoblinRun.Boot = Boot;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Menu = /** @class */ (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._moreGames = null;
            _this._aboutOn = null;
            _this._aboutOff = null;
            _this._mainOn = null;
            return _this;
        }
        // -------------------------------------------------------------------------
        Menu.prototype.create = function () {
            // light green color for background
            this.stage.backgroundColor = 0xA0DA6F;
            // setup camera and world bounds
            this.setView(this.game.width, this.game.height);
            // trees bg
            var treesHeight = this.cache.getImage("TreesBg").height;
            //this._treesBg = this.add.tileSprite(0, -this.game.height / 2, this.game.width, treesHeight, "TreesBg");
            //this._treesBg.anchor.x = 0.5;
            this._treesBg = new GoblinRun.BgLayer(this.game, this.world, "TreesBg", 0, 0, 1);
            // ground sprite
            this._ground = this.game.add.sprite(0, this.game.height / 2, this.generateGround());
            this._ground.anchor.set(0.5, 1);
            // groups
            this._mainGroup = new Phaser.Group(this.game);
            this._aboutGroup = new Phaser.Group(this.game);
            // objects on menu screen
            this.createGoblin();
            this.createTitle();
            this.createStartButton();
            // sound button
            this.createSoundButton();
            this.createInfoButton();
            // hiscore
            if (GoblinRun.Preferences.instance.hiscore >= 0) {
                var hiscore = new GoblinRun.HiScore(this.game, this._mainGroup);
                hiscore.position.set(0, 280);
                hiscore.score = GoblinRun.Preferences.instance.hiscore;
            }
            // create sponsor specific controls
            if (GoblinRun.Global.sponsor.id === 2 /* CLOUDGAMES */) {
                this.createCloudGamesControls();
            }
            // move groups to front
            this.world.bringToTop(this._mainGroup);
            this.world.bringToTop(this._aboutGroup);
            // create about and hide it
            this.createAbout();
            this._aboutGroup.visible = false;
            // input
            // key
            this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).onDown.add(this.processInput, this);
            // mouse
            this.game.input.onDown.add(this.processInput, this);
            // main tween
            this._mainOn = this.add.tween(this._mainGroup).to({ alpha: 1 }, 350, Phaser.Easing.Linear.None, false);
            // set sound and start music
            var mute = !GoblinRun.Preferences.instance.sound;
            if (GoblinRun.Global.sponsor.id === 3 /* GAMEARTER */) {
                mute = mute || window["globalMute"];
                //console.log("mute = " + mute + ", GlobalMute = " + window["globalMute"] + ", prefs = " + !Preferences.instance.sound);
            }
            this.sound.mute = mute;
            GoblinRun.Sounds.musicMenu.play();
        };
        // -------------------------------------------------------------------------
        Menu.prototype.setView = function (width, height) {
            // set bounds
            this.world.setBounds(-width / 2, -height / 2, width / 2, height / 2);
            // focus on game center
            this.camera.focusOnXY(0, 0);
        };
        // -------------------------------------------------------------------------
        Menu.prototype.processInput = function () {
            if (this._aboutGroup.visible && !this._aboutOn.isRunning) {
                this._aboutOff.start();
            }
        };
        // -------------------------------------------------------------------------
        Menu.prototype.generateGround = function () {
            var g = new Phaser.Graphics(this.game);
            // fill color
            g.beginFill(0x2B4940);
            // draw a shape
            g.moveTo(-1, 0);
            g.quadraticCurveTo(this.game.width / 2, Menu.GROUND_CP_Y, this.game.width, 0);
            g.lineTo(this.game.width, Menu.GROUND_HEIGHT);
            g.lineTo(-1, Menu.GROUND_HEIGHT);
            g.endFill();
            // generate texture from ggraphics
            var texture = g.generateTexture();
            // we do not need graphics anymore
            g.destroy();
            return texture;
        };
        // -------------------------------------------------------------------------
        Menu.prototype.createGoblin = function () {
            // random direction
            this._runDirection = this.rnd.sign();
            // create Spriter loader - class that can change Spriter file into internal structure
            var spriterLoader = new Spriter.Loader();
            var spriterFile = new Spriter.SpriterXml(this.cache.getXML("GoblinAnim"));
            var spriterData = spriterLoader.load(spriterFile);
            this._goblin = new Spriter.SpriterGroup(this.game, spriterData, "Sprites", "Goblin", "run", 100);
            this._goblin.scale.x = this._runDirection;
            // set position size
            this._goblin.position.set((this.game.width / 2 + 200) * this._runDirection, Menu.GOBLIN_Y);
            // adds SpriterGroup to Phaser.World to appear on screen
            this.world.add(this._goblin);
        };
        // -------------------------------------------------------------------------
        Menu.prototype.createTitle = function () {
            // title
            var title = this.add.sprite(0, -60, "Sprites", "Logo");
            title.anchor.set(0.5, 0.5);
            // title tweens
            this.add.tween(title).to({ angle: 3 }, 2500, function (k) {
                return Math.sin(k * 2 * Math.PI);
            }, true, 0, -1);
            this.add.tween(title.scale).to({ x: 1.02, y: 1.02 }, 1250, function (k) {
                return Math.sin(k * 2 * Math.PI);
            }, true, 0, -1);
            // add to main group
            this._mainGroup.add(title);
        };
        // -------------------------------------------------------------------------
        Menu.prototype.createStartButton = function () {
            // start button
            var start = this.add.button(0, 220 - 40, "Sprites", function () {
                // sponsor specific
                if (GoblinRun.Global.sponsor.id === 2 /* CLOUDGAMES */ || GoblinRun.Global.sponsor.id === 3 /* GAMEARTER */) {
                    GoblinRun.Global.sponsor.sdk.startGameSession();
                }
                if (GoblinRun.Preferences.instance.tutorial) {
                    this.game.state.start("Tutorial");
                }
                else {
                    this.game.state.start("Play");
                }
            }, this, "Start", "Start", "Start", "Start");
            start.anchor.set(0.5, 0.5);
            // input down callback
            start.onInputDown.add(function () {
                start.scale.set(0.9, 0.9);
                GoblinRun.Sounds.sfx.play("select");
            }, this);
            // start button tween
            this.add.tween(start.scale).to({ x: 1.2, y: 0.9 }, 750, function (k) {
                var period = k * 3;
                var decay = -k * 2;
                return Math.sin(period * Math.PI * 2) * Math.exp(decay);
            }, true, 2000, -1).repeatDelay(2000);
            // add to main group
            this._mainGroup.add(start);
        };
        // -------------------------------------------------------------------------
        Menu.prototype.createSoundButton = function () {
            var frameName = GoblinRun.Preferences.instance.sound ? "Sound_on" : "Sound_off";
            var sound = this.add.button(this.game.width / 2 - Menu.SOUND_BUTTON_OFFSET, -this.game.height / 2 + Menu.SOUND_BUTTON_OFFSET, "Sprites", function () {
                var prefs = GoblinRun.Preferences.instance;
                // toggle sound setting
                prefs.sound = !prefs.sound;
                var mute = !prefs.sound;
                if (GoblinRun.Global.sponsor.id === 3 /* GAMEARTER */) {
                    mute = mute || window["globalMute"];
                    //console.log("mute = " + mute + ", GlobalMute = " + window["globalMute"] + ", prefs = " + !prefs.sound);
                }
                this.sound.mute = mute;
                // change button icon
                var frameName = prefs.sound ? "Sound_on" : "Sound_off";
                sound.setFrames(frameName, frameName, frameName, frameName);
                GoblinRun.Sounds.sfx.play("select");
                prefs.save();
            }, this, frameName, frameName, frameName, frameName);
            sound.anchor.set(0.5, 0.5);
            this._sound = sound;
            // add to main group
            this._mainGroup.add(sound);
        };
        // -------------------------------------------------------------------------
        Menu.prototype.createInfoButton = function () {
            var frameName = "Info";
            var info = this.add.button(this.game.width / 2 - Menu.SOUND_BUTTON_OFFSET, -this.game.height / 2 + Menu.SOUND_BUTTON_OFFSET * 2.8, "Sprites", function () {
                this._mainGroup.visible = false;
                this._aboutGroup.visible = true;
                this._aboutGroup.scale.set(0);
                this._aboutOn.start();
                GoblinRun.Sounds.sfx.play("select");
            }, this, frameName, frameName, frameName, frameName);
            info.anchor.set(0.5, 0.5);
            this._info = info;
            // add to main group
            this._mainGroup.add(info);
        };
        // -------------------------------------------------------------------------
        Menu.prototype.createAbout = function () {
            var about = new GoblinRun.About(this.game, this._aboutGroup);
            // tween on
            this._aboutOn = this.add.tween(this._aboutGroup.scale)
                .to({ x: 1, y: 1 }, 300, function (k) {
                return -2 * k * k + 3 * k;
            }, false);
            // tween off
            this._aboutOff = this.add.tween(this._aboutGroup.scale)
                .to({ x: 0, y: 0 }, 300, function (k) {
                k = 1 - k;
                var r = -2 * k * k + 3 * k;
                return -(r - 1);
            }, false);
            this._aboutOff.onComplete.add(function () {
                //this.time.events.add(100, function () {
                this._aboutGroup.visible = false;
                this._mainGroup.alpha = 0;
                this._mainGroup.visible = true;
                this._mainOn.start();
                //    this._mainGroup.visible = true;
                //}, this);                
            }, this);
        };
        // -------------------------------------------------------------------------
        Menu.prototype.createCloudGamesControls = function () {
            // more games
            var frameName = "MoreGames";
            var moreGames = this.add.button(this.game.width / 2 - Menu.SOUND_BUTTON_OFFSET, this.game.height / 2 - Menu.SOUND_BUTTON_OFFSET, "Sprites", function () {
                GoblinRun.Sounds.sfx.play("select");
                var cloudGamesSDK = GoblinRun.Global.sponsor.sdk;
                if (cloudGamesSDK.linksActive()) {
                    window.open(cloudGamesSDK.getLink("games"));
                }
            }, this, frameName, frameName, frameName, frameName);
            moreGames.anchor.set(0.5, 0.5);
            this._moreGames = moreGames;
            // add to main group
            this._mainGroup.add(moreGames);
            // logo
            if (this.cache.checkImageKey("CloudGamesLogo")) {
                var logo = this.game.add.button(-this.game.width / 2 + Menu.SOUND_BUTTON_OFFSET - 38, this.game.height / 2 - Menu.SOUND_BUTTON_OFFSET + 38, "CloudGamesLogo", function () {
                    var cloudGamesSDK = GoblinRun.Global.sponsor.sdk;
                    if (cloudGamesSDK.linksActive()) {
                        window.open(cloudGamesSDK.getLink("logo"));
                    }
                }, this);
                var logoWidth = logo.width;
                logo.anchor.setTo(0, 1);
                logo.width = Math.min(this.game.width * 0.25, 250);
                logo.scale.y = logo.width / logoWidth;
                this._mainGroup.add(logo);
            }
            else {
                console.warn("CloudGamesLogo not in cache");
            }
        };
        // -------------------------------------------------------------------------
        Menu.prototype.update = function () {
            // elapsed time in seconds
            var delta = this.time.elapsed / 1000;
            // move bg
            //this._treesBg.tilePosition.x -= Menu.BG_SPEED_X * delta;
            this._treesBg.updatePosition(this.time.time / 1000 * Menu.BG_SPEED_X);
            // update goblin anim
            this._goblin.updateAnimation();
            // update goblin x poisiton
            this._goblin.x += Menu.GOBLIN_SPEED * delta * this._runDirection;
            // check if too far on right or left.
            if (this._goblin.x * this._runDirection > this.game.width / 2 + 200) {
                this._runDirection *= -1;
                this._goblin.x = -(this.game.width / 2 + 200) * this._runDirection;
                this._goblin.scale.x = this._runDirection;
            }
            // calculate goblin Y position
            // three points for quadratic bezier curve (start point - control point - end point)
            // we need to calculate only y position so we can omit x coordinates
            var y0 = 0;
            var cy = Menu.GROUND_CP_Y;
            var y1 = 0;
            // map current goblin's position on screen into interval 0..1
            var t = Phaser.Math.clamp(Phaser.Math.mapLinear(this._goblin.x, -this.game.width / 2, this.game.width / 2, 0, 1), 0, 1);
            // calculate y position
            this._goblin.y = Menu.GOBLIN_Y + Phaser.Math.linear(Phaser.Math.linear(y0, cy, t), Phaser.Math.linear(cy, y1, t), t);
        };
        // -------------------------------------------------------------------------
        Menu.prototype.shutdown = function () {
            // stop music when leaving this state
            GoblinRun.Sounds.musicMenu.stop();
        };
        // -------------------------------------------------------------------------
        Menu.prototype.onResize = function (width, height) {
            // resize vamera position and world bounds
            this.setView(width, height);
            // recreate ground texture
            this._ground.setTexture(this.generateGround());
            // change tilesprite width
            //this._treesBg.width = width;
            // reposition sound button
            this._sound.position.set(this.game.width / 2 - Menu.SOUND_BUTTON_OFFSET, -this.game.height / 2 + Menu.SOUND_BUTTON_OFFSET);
            // reposition info button
            this._info.position.set(this.game.width / 2 - Menu.SOUND_BUTTON_OFFSET, -this.game.height / 2 + Menu.SOUND_BUTTON_OFFSET * 2.8);
            if (this._moreGames != null) {
                this._moreGames.position.set(this.game.width / 2 - Menu.SOUND_BUTTON_OFFSET, this.game.height / 2 - Menu.SOUND_BUTTON_OFFSET);
            }
        };
        Menu.GROUND_HEIGHT = 250;
        Menu.GROUND_CP_Y = 50;
        Menu.GOBLIN_Y = Menu.GROUND_CP_Y - 10;
        Menu.GOBLIN_SPEED = 200;
        Menu.BG_SPEED_X = 10;
        Menu.SOUND_BUTTON_OFFSET = 50;
        return Menu;
    }(Phaser.State));
    GoblinRun.Menu = Menu;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Preload = /** @class */ (function (_super) {
        __extends(Preload, _super);
        function Preload() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // music decoded, ready for game
            _this._ready = false;
            return _this;
        }
        // -------------------------------------------------------------------------
        Preload.prototype.preload = function () {
            this.stage.backgroundColor = 0x2B4940;
            this.setView(this.game.width, this.game.height);
            // create graphics for loading bar
            var g = new Phaser.Graphics(this.game);
            // fill color
            g.beginFill(0xF0F0F0);
            // draw a shape
            g.drawRect(0, 0, 8, 8);
            // loading bar sprite
            this._loadingBar = this.add.sprite(-Preload.LOADING_BAR_WIDTH / 2, 0, g.generateTexture());
            this._loadingBar.width = 0;
            this._loadingBar.height = 48;
            // we do not need graphics anymore
            g.destroy();
            // laoding text
            this._loadingText = this.add.bitmapText(0, 60, "Font", "0%", 40);
            this._loadingText.anchor.x = 0.5;
            //this.load.image("Block", "assets/Block.png");
            //this.load.image("Player", "assets/Player.png");
            // atlas
            this.load.atlas("Sprites", "assets/Sprites.png", "assets/Sprites.json");
            this.load.atlas("Pause", "assets/Pause.png", "assets/Pause.json");
            // spriter anim
            this.load.xml("GoblinAnim", "assets/Goblin.xml");
            // background layer sprites
            this.load.image("Mud", "assets/Mud.png");
            this.load.image("Hill", "assets/Hill.png");
            this.load.image("TreesBg", "assets/TreesBg.png");
            this.load.image("Tutorial", "assets/Tutorial.png");
            // font
            // this.load.bitmapFont("Font", "assets/Font.png", "assets/Font.xml");
            this.load.bitmapFont("Alphabet", "assets/Alphabet.png", "assets/Alphabet.xml");
            // config
            this.load.json("Config", "assets/config.json");
            // sound fx
            // iterate through all audiosprites
            //for (let property in Sounds.AUDIO_JSON.spritemap) {
            //    let audioSprite = Sounds.AUDIO_JSON.spritemap[property];
            //    console.log("name: " + property + ", value: " + JSON.stringify(audioSprite));
            //}
            this.load.audiosprite("Sfx", GoblinRun.Sounds.AUDIO_JSON.resources, null, GoblinRun.Sounds.AUDIO_JSON);
            // music
            this.load.audio("MusicGame", ["assets/MusicGame.ogg", "assets/MusicGame.m4a"]);
            this.load.audio("MusicMenu", ["assets/MusicMenu.ogg", "assets/MusicMenu.m4a"]);
            // sponsor specific
            if (GoblinRun.Global.sponsor.id === 2 /* CLOUDGAMES */) {
                var getAbsoluteUrl = (function () {
                    var a;
                    return function (url) {
                        if (!a)
                            a = document.createElement('a');
                        a.href = url;
                        //console.log("a.href = " + a.href);
                        return a.href;
                    };
                })();
                this.load.crossOrigin = "anonymous";
                var sdk = GoblinRun.Global.sponsor.sdk;
                var imageUrl = sdk.getLogoLink(true);
                imageUrl = getAbsoluteUrl(imageUrl);
                //console.log("url = " + imageUrl);
                this.load.image("CloudGamesLogo", imageUrl);
            }
        };
        // -------------------------------------------------------------------------
        Preload.prototype.onResize = function (width, height) {
            this.setView(width, height);
        };
        // -------------------------------------------------------------------------
        Preload.prototype.setView = function (width, height) {
            // set bounds
            this.world.setBounds(-width / 2, -height / 2, width / 2, height / 2);
            // focus on game center
            this.camera.focusOnXY(0, 0);
        };
        // -------------------------------------------------------------------------
        Preload.prototype.loadUpdate = function () {
            // update bar width
            this._loadingBar.width = Preload.LOADING_BAR_WIDTH * this.load.progress / 100;
            // update loading text percent
            this._loadingText.text = this.load.progress + "%";
        };
        // -------------------------------------------------------------------------
        Preload.prototype.readConfig = function () {
            // read config
            var config = this.game.cache.getJSON("Config");
            console.log("--- setting config values ---");
            for (var property in config) {
                console.log("name = " + property + ", value = " + config[property]);
                Generator.Parameters[property] = config[property];
            }
            console.log("-----------------------------");
        };
        // -------------------------------------------------------------------------
        Preload.prototype.create = function () {
            // update bar width
            this._loadingBar.width = Preload.LOADING_BAR_WIDTH;
            this._loadingText.text = "100%";
            // config
            this.readConfig();
            // sound
            GoblinRun.Sounds.sfx = this.add.audioSprite("Sfx");
            // music
            GoblinRun.Sounds.musicGame = this.add.audio("MusicGame");
            GoblinRun.Sounds.musicGame.loop = true;
            GoblinRun.Sounds.musicMenu = this.add.audio("MusicMenu");
            GoblinRun.Sounds.musicMenu.loop = true;
        };
        // -------------------------------------------------------------------------
        Preload.prototype.update = function () {
            // run only once
            if (this._ready === false &&
                this.cache.isSoundDecoded("Sfx") &&
                this.cache.isSoundDecoded("MusicGame") &&
                this.cache.isSoundDecoded("MusicMenu")) {
                this._ready = true;
                if (!Generator.Parameters.FORCE_TAP) {
                    // small delay before changing state
                    this.time.events.add(500, function () {
                        this.game.state.start("Menu");
                    }, this);
                }
                else {
                    this.time.events.add(250, function () {
                        // hide bar
                        this._loadingBar.visible = this._loadingText.visible = false;
                        // show tap hand
                        var hand = this.add.sprite(0, 50, "Pause", "touch01");
                        hand.anchor.set(0.5);
                        hand.animations.add("Touch", ["touch01", "touch02", "touch03", "touch04", "touch05", "touch06",
                            "touch01", "touch01", "touch01", "touch01", "touch01", "touch01", "touch01", "touch01"], 8, true, false);
                        hand.animations.play("Touch");
                        this.input.onDown.add(function () {
                            this.game.state.start("Menu");
                        }, this);
                    }, this);
                }
            }
        };
        Preload.LOADING_BAR_WIDTH = 300;
        return Preload;
    }(Phaser.State));
    GoblinRun.Preload = Preload;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Play = /** @class */ (function (_super) {
        __extends(Play, _super);
        function Play() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._jumpTimer = 0;
            _this._bonusJump = false;
            // status
            _this._gameOver = false;
            _this._justDown = false;
            _this._justUp = false;
            // score
            _this._distanceScore = 0;
            _this._goldScore = 0;
            _this._score = 0;
            _this._pauseUI = null;
            _this._pauseScreen = null;
            _this._resultOn = null;
            _this._resultOff = null;
            _this._touchingDown = false;
            _this._runCounter = 0;
            return _this;
            //// -------------------------------------------------------------------------
            //public onResume(): void {
            //    this.game.paused = false;
            //}
        }
        // -------------------------------------------------------------------------
        Play.prototype.render = function () {
            // this._mainLayer.render();
            //this.game.debug.body(this._player, "RGBA(255, 0, 0, 0.2)");
        };
        // -------------------------------------------------------------------------
        Play.prototype.create = function () {
            this.stage.backgroundColor = 0xA0DA6F;
            // camera
            this.camera.bounds = null;
            // physics
            this.physics.arcade.gravity.y = Generator.Parameters.GRAVITY;
            //Generator.JumpTables.setDebug(true, GoblinRun.Global);
            Generator.JumpTables.instance;
            // this.game.add.sprite(0, 0, Generator.JumpTables.debugBitmapData);
            // background layers
            this._bg = new GoblinRun.Background(this.game, this.world);
            // layer with platforms
            this._mainLayer = new GoblinRun.MainLayer(this.game, this.world);
            // set player
            this._player = new GoblinRun.Player(this.game);
            this._player.position.set(96, 64 * 1);
            this.world.add(this._player);
            // create shadow
            this._shadow = new GoblinRun.Shadow(this.game, this._player.position, this._mainLayer.walls);
            // we want to place shadow on platforms, but under items
            var wallIndex = this._mainLayer.getChildIndex(this._mainLayer.walls);
            this._mainLayer.addChildAt(this._shadow, wallIndex + 1);
            // dust particles
            var emitter = new Phaser.Particles.Arcade.Emitter(this.game, 0, 0, 16);
            emitter.makeParticles("Sprites", ["DustParticle"]);
            emitter.setYSpeed(-50, -20);
            emitter.setRotation(0, 0);
            emitter.setAlpha(1, 0, 500, Phaser.Easing.Linear.None);
            emitter.gravity = new Phaser.Point(0, -Generator.Parameters.GRAVITY);
            this.world.add(emitter);
            this._dustEmitter = emitter;
            // score UI on screen
            // pause button
            this.createPauseButton();
            // gold
            this._scoreUI = new GoblinRun.ScoreUI(this.game, this.world, "Gold2", false);
            this._scoreUI.fixedToCamera = true;
            this._scoreUI.cameraOffset.set(this.game.width - 65 - GoblinRun.Menu.SOUND_BUTTON_OFFSET, 30);
            // distance
            this._distanceUI = new GoblinRun.ScoreUI(this.game, this.world, "Distance", true);
            this._distanceUI.fixedToCamera = true;
            this._distanceUI.cameraOffset.set(45, 30);
            // result board
            this.createResultScreen();
            // pause screen
            this._pauseScreen = new GoblinRun.PauseScreen(this.game, this.world);
            this._pauseScreen.onHide.add(function () {
                this._btnPause.exists = this._btnPause.visible = true;
            }, this);
            // input
            // key
            this._jumpKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            // mouse
            this.game.input.onDown.add(function (pointer) {
                if (pointer.y < 80) {
                    return;
                }
                if (this._pauseScreen.visible) {
                    this._pauseScreen.hide();
                    this.physics.arcade.isPaused = false;
                    this._pauseUI.exists = this._pauseUI.visible = true;
                    this._scoreUI.visible = true;
                    this._distanceUI.visible = true;
                }
                else {
                    this._justDown = true;
                }
            }, this);
            this.game.input.onUp.add(function (pointer) {
                if (pointer.y < 80) {
                    return;
                }
                this._justUp = true;
            }, this);
            // reset variables
            this._gameOver = false;
            this._score = 0;
            this._bonusJump = false;
            this._justDown = this._justUp = false;
            this._distanceScore = 0;
            this._goldScore = 0;
            // start music
            GoblinRun.Sounds.musicGame.play();

            //PPS_USE-GAMELOFT
            /*
            gameloft_levelStart();
            //PPS_USE-GAMELOFT
            */
        };
        // -------------------------------------------------------------------------
        Play.prototype.createPauseButton = function () {
            var frameName = "Pause";
            var pause = this.add.button(0, 0, "Sprites", function () {
                GoblinRun.Sounds.sfx.play("select");
                // already game over?
                if (this._gameOver) {
                    return;
                }
                this.paused();
            }, this, frameName, frameName, frameName, frameName);
            pause.anchor.set(0.5, 0.5);
            pause.scale.set(0.75);
            pause.fixedToCamera = true;
            pause.cameraOffset.set(this.game.width - GoblinRun.Menu.SOUND_BUTTON_OFFSET * 0.7, GoblinRun.Menu.SOUND_BUTTON_OFFSET * 0.65);
            this._pauseUI = pause;
        };
        // -------------------------------------------------------------------------
        Play.prototype.update = function () {
            if (this._pauseScreen.visible) {
                return;
            }
            var oldGoldScore = this._goldScore;
            var oldDistanceScore = this._distanceScore;
            if (!this._gameOver) {
                this.updatePhysics();
                // move camera
                this.camera.x = this._player.x - 256; //192;
                // generate level
                this._mainLayer.generate(this.camera.x / Generator.Parameters.CELL_SIZE);
                // update score
                this._distanceScore = (Math.floor((this._player.x - 96) / 64)) * 1;
                //this._score = this._goldScore + this._distanceScore;
                if (this._goldScore !== oldGoldScore) {
                    this._scoreUI.score = this._goldScore;
                    this._scoreUI.bounce();
                }
                if (this._distanceScore !== oldDistanceScore) {
                    this._distanceUI.score = this._distanceScore;
                }
            }
            else {
                if (this._jumpKey.justDown) {
                    this._justDown = true;
                }
                // hide result screen
                if (this._justDown && this._result.visible && !this._resultOn.isRunning && !this._resultOff.isRunning) {
                    this._result.characterOn(false);
                    this._resultOff.start();
                }
            }
            // check if player is still on screen
            if (this._player.y > this.game.height - 104) {
                this._player.y = this.game.height - 104;
                this.gameOver();
                // stop music
                GoblinRun.Sounds.musicGame.stop();
                this._player.animateDeath();
                console.log("GAME OVER - fall");
            }
            // update player animations
            var body = this._player.body;
            this._player.updateAnim(body.velocity.y >= 0 && body.touching.down, body.velocity.y, this._gameOver);
            // dust particles when landing
            if (!this._touchingDown && body.touching.down && !this._gameOver) {
                this.emitDustLanding();
            }
            this._touchingDown = body.touching.down;
            // dust particles when running
            this.emitDustRunning();
            // move background
            this._bg.updateLayers(this.camera.x);
        };
        // -------------------------------------------------------------------------
        Play.prototype.updatePhysics = function () {
            var body = this._player.body;
            // overlap with items - spikes, bonuses, ...
            this.physics.arcade.overlap(this._player, this._mainLayer.items, this.onOverlap, null, this);
            if (this._gameOver) {
                return;
            }
            // clear touching
            body.touching.none = true;
            body.touching.up = body.touching.down = body.touching.left = body.touching.right = false;
            // collision with walls
            var wallCollision = this.physics.arcade.collide(this._player, this._mainLayer.walls);
            // move
            if (wallCollision && body.touching.right) {
                body.velocity.set(0, 0);
                this.gameOver();
                this._player.animateHit();
                console.log("GAME OVER - hit");
                return;
            }
            // set body velocity
            body.velocity.x = Generator.Parameters.VELOCITY_X;
            // read keyboard
            if (this._jumpKey.justDown) {
                this._justDown = true;
            }
            if (this._jumpKey.justUp) {
                this._justUp = true;
            }
            var jumpTable = Generator.JumpTables.instance;
            // start jump
            if ((this._justDown && body.touching.down && this.game.time.now > this._jumpTimer) ||
                (this._justDown && this._bonusJump)) {
                body.velocity.y = jumpTable.maxJumpVelocity;
                this._jumpTimer = this.game.time.now + 150;
                this._justDown = false;
                this._bonusJump = false;
                this._player.animateJump();
            }
            // stop jump
            if (this._justUp && body.velocity.y < jumpTable.minJumpVelocity) {
                body.velocity.y = jumpTable.minJumpVelocity;
            }
            // if down pressed, but player is going up, then clear it
            if (body.velocity.y <= 0) {
                this._justDown = false;
            }
            // if key is released then clear down press
            if (this._justUp) {
                this._justDown = false;
            }
            // just up was processed - clear it
            this._justUp = false;
        };
        // -------------------------------------------------------------------------
        Play.prototype.onOverlap = function (player, item) {
            if (item.itemType === 0 /* SPIKE */) {
                this._player.body.velocity.set(0, 0);
                this._player.animateHit();
                console.log("GAME OVER - spike");
                this.gameOver();
            }
            else if (item.itemType === 1 /* BONUS_JUMP */) {
                this._bonusJump = true;
                this._mainLayer.removeItem(item);
                GoblinRun.Sounds.sfx.play("bonus_jump");
            }
            else if (item.itemType === 2 /* GOLD */) {
                this._mainLayer.removeItem(item);
                GoblinRun.Sounds.sfx.play("gold");
                // add score and make bounce effect of score icon
                this._goldScore += 1;
                //this._scoreUI.score = this._score;
                //this._scoreUI.bounce();
            }
        };
        // -------------------------------------------------------------------------
        Play.prototype.emitDustLanding = function () {
            this._dustEmitter.emitX = this._player.x + 20;
            this._dustEmitter.emitY = this._player.y + 90;
            this._dustEmitter.setXSpeed(-100, 0);
            this._dustEmitter.explode(500, 2);
            this._dustEmitter.setXSpeed(0, 100);
            this._dustEmitter.explode(500, 2);
        };
        // -------------------------------------------------------------------------
        Play.prototype.emitDustRunning = function () {
            if (this._player.animName !== "run") {
                return;
            }
            var counter = Math.floor(this.game.time.time / 250);
            if (counter > this._runCounter) {
                this._runCounter = counter;
                this._dustEmitter.emitX = this._player.x;
                this._dustEmitter.emitY = this._player.y + 80;
                this._dustEmitter.setXSpeed(-100, 0);
                this._dustEmitter.emitParticle();
            }
        };
        // -------------------------------------------------------------------------
        Play.prototype.gameOver = function () {
            // game over already set?
            if (this._gameOver) {
                return;
            }
            this._gameOver = true;
            // check distance for new record
            var settings = GoblinRun.Preferences.instance;
            var doSave = false;
            var newDistance = Math.floor(this._player.x / 64);
            // new record?
            if (newDistance > settings.record) {
                settings.record = newDistance;
                doSave = true;
            }
            this._score = this._goldScore * Play.SCORE_FOR_GOLD + this._distanceScore;
            if (this._score > settings.hiscore) {
                settings.hiscore = this._score;
                doSave = true;
            }
            if (doSave) {
                settings.save();
            }
            // show result
            this.time.events.add(3000, function () {
                this._justDown = false;
                this._scoreUI.visible = false;
                this._distanceUI.visible = false;
                this._pauseUI.visible = false;
                console.log("GOLD = " + this._goldScore);
                this._result.init(this._distanceScore, this._goldScore, settings.hiscore);
                this._result.visible = true;
                this._resultOn.start();
            }, this);

            //PPS_USE-GAMELOFT
            /*
            gameloft_levelComplete();
            //PPS_USE-GAMELOFT
            */
        };
        // -------------------------------------------------------------------------
        Play.prototype.returnToMainMenu = function () {
            // sponsor specific
            if (GoblinRun.Global.sponsor.id === 2 /* CLOUDGAMES */) {
                GoblinRun.Global.sponsor.sdk.endGameSession({ score: this._score });
            }
            else if (GoblinRun.Global.sponsor.id === 3 /* GAMEARTER */) {
                GoblinRun.Global.sponsor.sdk.showAd(null, null, false);
            }
            this.game.state.start("Menu");
        };
        // -------------------------------------------------------------------------
        Play.prototype.createResultScreen = function () {
            // result screen
            this._result = new GoblinRun.Result(this.game, this.world);
            this._result.fixedToCamera = true;
            this._result.cameraOffset.set(this.game.width / 2, this.game.height / 2);
            this._result.scale.set(0);
            this._result.visible = false;
            // tween on
            this._resultOn = this.add.tween(this._result.scale)
                .to({ x: 1, y: 1 }, 300, function (k) {
                return -2 * k * k + 3 * k;
            }, false);
            // sponsor specific
            this._resultOn.onComplete.add(function () {
                this._result.characterOn(true);
                if (GoblinRun.Global.sponsor.id === 4 /* WKB */) {
                    GoblinRun.Global.sponsor.sdk.endGameSession({ score: this._score });
                }
            }, this);
            // tween off
            this._resultOff = this.add.tween(this._result.scale)
                .to({ x: 0, y: 0 }, 300, function (k) {
                k = 1 - k;
                var r = -2 * k * k + 3 * k;
                return -(r - 1);
            }, false);
            this._resultOff.onComplete.add(function () {
                this._result.visible = false;
                this.game.time.events.add(250, this.returnToMainMenu, this);
            }, this);
        };
        // -------------------------------------------------------------------------
        Play.prototype.onResize = function (width, height) {
            // pause
            this._pauseUI.cameraOffset.set(this.game.width - GoblinRun.Menu.SOUND_BUTTON_OFFSET * 0.7, GoblinRun.Menu.SOUND_BUTTON_OFFSET * 0.65);
            //this._bg.resize();
            this._result.cameraOffset.set(this.game.width / 2, this.game.height / 2);
            // reposition carrots
            this._scoreUI.cameraOffset.set(this.game.width - 65 - GoblinRun.Menu.SOUND_BUTTON_OFFSET, 30);
            this._pauseScreen.resize(width, height);
        };
        // -------------------------------------------------------------------------
        Play.prototype.paused = function () {
            //this.game.paused = true;
            if (!this._pauseScreen.visible && !this._gameOver) {
                this._pauseUI.exists = this._pauseUI.visible = false;
                this._scoreUI.visible = false;
                this._distanceUI.visible = false;
                this._pauseScreen.show();
                this.physics.arcade.isPaused = true;
            }
        };
        // -------------------------------------------------------------------------
        Play.prototype.onPause = function () {
            this.paused();
        };
        Play.SCORE_FOR_GOLD = 10;
        return Play;
    }(Phaser.State));
    GoblinRun.Play = Play;
})(GoblinRun || (GoblinRun = {}));
var GoblinRun;
(function (GoblinRun) {
    var Tutorial = /** @class */ (function (_super) {
        __extends(Tutorial, _super);
        // -------------------------------------------------------------------------
        function Tutorial() {
            return _super.call(this) || this;
        }
        // -------------------------------------------------------------------------
        Tutorial.prototype.onResize = function (width, height) {
            this.setView(width, height);
        };
        // -------------------------------------------------------------------------
        Tutorial.prototype.setView = function (width, height) {
            // set bounds
            this.world.setBounds(-width / 2, -height / 2, width / 2, height / 2);
            // focus on game center
            this.camera.focusOnXY(0, 0);
        };
        // -------------------------------------------------------------------------
        Tutorial.prototype.create = function () {
            this.stage.backgroundColor = 0xA0DA6F;
            // set camera
            this.camera.bounds = null;
            // set camera
            this.setView(this.game.width, this.game.height);
            // input
            // key
            this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).onDown.add(this.processInput, this);
            // mouse
            this.game.input.onDown.add(this.processInput, this);
            // tutorial
            var tutorial = this.game.add.sprite(0, 0, "Tutorial");
            tutorial.anchor.set(0.5);
            tutorial.x = this.game.width;
            this._tutorial = tutorial;
            // tween tutorial
            this._tutTween = this.game.add.tween(tutorial).to({ x: 0 }, 1000, Phaser.Easing.Quartic.Out, true);
            // save settings - do not show tutorial next time
            var settings = GoblinRun.Preferences.instance;
            settings.tutorial = false;
            settings.save();
        };
        // -------------------------------------------------------------------------
        Tutorial.prototype.processInput = function () {
            if (this._tutTween.isRunning) {
                return;
            }
            this._tutTween = this.game.add.tween(this._tutorial).to({ x: -this.game.width }, 1000, Phaser.Easing.Quartic.In, true);
            this._tutTween.onComplete.add(function () {
                this.game.state.start("Play");
            }, this);
        };
        return Tutorial;
    }(Phaser.State));
    GoblinRun.Tutorial = Tutorial;
})(GoblinRun || (GoblinRun = {}));
var Sponsor;
(function (Sponsor) {
    var SponsorAdapter = /** @class */ (function () {
        // -------------------------------------------------------------------------
        function SponsorAdapter(game) {
            this._game = null;
            if (typeof game !== "undefined" && game !== null) {
                this._game = game;
            }
        }
        Object.defineProperty(SponsorAdapter.prototype, "game", {
            // -------------------------------------------------------------------------
            set: function (game) {
                this._game = game;
            },
            enumerable: true,
            configurable: true
        });
        // -------------------------------------------------------------------------
        SponsorAdapter.prototype.startGameSession = function (aObject) {
            console.log("Sponsor Adapter: startGameSession");
        };
        // -------------------------------------------------------------------------
        SponsorAdapter.prototype.endGameSession = function (aObject) {
            console.log("Sponsor Adapter: endGameSession");
        };
        // -------------------------------------------------------------------------
        SponsorAdapter.prototype.levelUp = function (aObject) {
            console.log("Sponsor Adapter: levelUp");
        };
        // -------------------------------------------------------------------------
        SponsorAdapter.prototype.gameOver = function (aObject) {
            console.log("Sponsor Adapter: gameOver");
        };
        // -------------------------------------------------------------------------
        SponsorAdapter.prototype.submitScore = function (aLevel, aScore) {
            console.log("Sponsor Adapter: submitScore");
        };
        // -------------------------------------------------------------------------
        SponsorAdapter.prototype.showAd = function (aCallback, aContext, aForce) {
            if (aForce === void 0) { aForce = false; }
            console.log("Sponsor Adapter: showAd");
        };
        // -------------------------------------------------------------------------
        SponsorAdapter.prototype.forceAd = function (aCallback, aContext) {
            console.log("Sponsor Adapter: forceAd");
            this.showAd(aCallback, aContext, true);
        };
        // -------------------------------------------------------------------------
        SponsorAdapter.prototype.showSplash = function () {
            console.log("Sponsor Adapter: showSplash");
        };
        // -------------------------------------------------------------------------
        SponsorAdapter.prototype.moreGamesLink = function () {
            console.log("Sponsor Adapter: moreGameLink");
        };
        // -------------------------------------------------------------------------
        SponsorAdapter.prototype.showLogo = function () {
            console.log("Sponsor Adapter: showBranding");
        };
        // -------------------------------------------------------------------------
        SponsorAdapter.prototype.hideLogo = function () {
            console.log("Sponsor Adapter: hideBranding");
        };
        // -------------------------------------------------------------------------
        SponsorAdapter.prototype.submitAchievement = function (aID) {
            console.log("Sponsor Adapter: submitAchievement");
        };
        return SponsorAdapter;
    }());
    Sponsor.SponsorAdapter = SponsorAdapter;
})(Sponsor || (Sponsor = {}));
var Sponsor;
(function (Sponsor) {
    var SponsorCloudGames = /** @class */ (function (_super) {
        __extends(SponsorCloudGames, _super);
        // -------------------------------------------------------------------------
        function SponsorCloudGames(game, gameID) {
            var _this = _super.call(this, game) || this;
            _this._sdk = null;
            _this._sdk = window.CloudAPI;
            if (!_this.hasSDK()) {
                return _this;
            }
            // init
            _this._sdk.init({
                id: gameID,
                splash: false
            });
            // mute
            _this._sdk.mute = function () {
                game.sound.mute = true;
                return true;
            };
            // unmute
            _this._sdk.unmute = function () {
                game.sound.mute = false;
                game.paused = false;
                return true;
            };
            return _this;
        }
        // -------------------------------------------------------------------------
        SponsorCloudGames.prototype.hasSDK = function () {
            return this._sdk != null;
        };
        // -------------------------------------------------------------------------
        SponsorCloudGames.prototype.startGameSession = function (aObject) {
            console.log("CloudGames - CloudAPI: starting game session");
            if (this.hasSDK()) {
                this._sdk.play();
            }
        };
        // -------------------------------------------------------------------------
        SponsorCloudGames.prototype.endGameSession = function (aObject) {
            console.log("CloudGames - CloudAPI: ending game session");
            if (this.hasSDK()) {
                this._sdk.gameOver();
            }
        };
        // -------------------------------------------------------------------------
        SponsorCloudGames.prototype.showAd = function (aCallback, aContext, aForce) {
            if (aForce === void 0) { aForce = false; }
            console.log("CloudGames - CloudAPI: showAd() => forward to endGameSession()");
            this.endGameSession();
        };
        // -------------------------------------------------------------------------
        // -------------------------------------------------------------------------
        // -------------------------------------------------------------------------
        SponsorCloudGames.prototype.linksActive = function () {
            if (this.hasSDK()) {
                return this._sdk.links.active();
            }
            else {
                return false;
            }
        };
        // -------------------------------------------------------------------------
        SponsorCloudGames.prototype.getLink = function (key) {
            if (!this.hasSDK()) {
                return null;
            }
            var linksList = this._sdk.links.list();
            if (typeof linksList[key] === "undefined") {
                console.log("CloudGames - CloudAPI: unknown link type " + key);
                return null;
            }
            return linksList[key];
        };
        // -------------------------------------------------------------------------
        SponsorCloudGames.prototype.logosActive = function () {
            if (this.hasSDK()) {
                this._sdk.logos.active();
            }
            else {
                return false;
            }
        };
        // -------------------------------------------------------------------------
        SponsorCloudGames.prototype.getLogoLink = function (horizontal) {
            if (horizontal === void 0) { horizontal = true; }
            if (!this.hasSDK()) {
                return null;
            }
            var logosList = this._sdk.logos.list();
            return horizontal ? logosList.horizontal : logosList.vertical;
        };
        return SponsorCloudGames;
    }(Sponsor.SponsorAdapter));
    Sponsor.SponsorCloudGames = SponsorCloudGames;
})(Sponsor || (Sponsor = {}));
var Sponsor;
(function (Sponsor) {
    var SponsorGameArter = /** @class */ (function (_super) {
        __extends(SponsorGameArter, _super);
        // -------------------------------------------------------------------------
        function SponsorGameArter(game) {
            var _this = _super.call(this, game) || this;
            _this._sdk = null;
            _this._sdk = window["gameArterSdk"];
            return _this;
        }
        // -------------------------------------------------------------------------
        SponsorGameArter.prototype.startGameSession = function (aObject) {
            console.log("gameArter start session - send level");
            var level = 0;
            if (aObject != null) {
                level = aObject.level || 0;
            }
            console.log("ending gameArter session, level = " + level);
            if (this._sdk != null) {
                this._sdk.Analytics._i(level);
            }
            else {
                console.warn("gameArter sdk is null!");
            }
        };
        // -------------------------------------------------------------------------
        SponsorGameArter.prototype.showAd = function (aCallback, aContext, aForce) {
            if (aForce === void 0) { aForce = false; }
            console.log("gameArter show ads");
            if (this._sdk != null) {
                this._sdk.Ads._i();
            }
            else {
                console.warn("gameArter sdk is null!");
            }
        };
        return SponsorGameArter;
    }(Sponsor.SponsorAdapter));
    Sponsor.SponsorGameArter = SponsorGameArter;
})(Sponsor || (Sponsor = {}));
