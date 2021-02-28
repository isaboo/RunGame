var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        function floor(x, height) {
            this.x = x;
            this.width = 700;
            this.height = height;
        }
        if(localStorage.runbest) {
            var highscore = localStorage.runbest;
        }
        else{
            localStorage.runbest = 0;
            var highscore = localStorage.runbest;
        }
        var world = {
            height: 480,
            width: 640,
            gravity: 10,
            highestFloor: 240,
            speed: 5,
            distanceTravelled: 0,
            maxSpeed: 15,
            tilesPassed: 0,
            autoScroll: true,
            floorTiles: [
                new floor(0, 140)
            ],
            stop: function() {
                this.autoScroll = false;
                window.setTimeout("world.end()", 600);
            },
            end: function() {
                document.getElementById("canvas").className = "hidden";
                document.getElementById("end").className = "show";
                document.getElementById("speed").innerHTML = world.speed;
                document.getElementById("score").innerHTML = world.distanceTravelled;
                if(highscore < world.distanceTravelled) {
                    document.getElementById("best?").innerHTML = "You beat your highscore of: ";
                    document.getElementById("best").innerHTML = highscore;
                    localStorage.runbest = world.distanceTravelled;
                }
                else {
                    document.getElementById("best?").innerHTML = "Your highcore is: "
                    document.getElementById("best").innerHTML = highscore;
                }
            },
            moveFloor: function() {
                for(index in this.floorTiles) {
                    var tile = this.floorTiles[index];
                    tile.x -= this.speed;
                    this.distanceTravelled += this.speed;
                }
            },
            addFutureTiles: function() {
                if(this.floorTiles.length >= 3) {
                    return;
                }
                var previousTile = this.floorTiles[this.floorTiles.length - 1];
                var biggestJumpable = previousTile.height + player.height * 30;
                var biggestJumpableHeight = biggestJumpable - 90;
                if(biggestJumpableHeight > this.highestFloor) {
                    biggestJumpableHeight = this.highestFloor;
                }
                var lowest = player.height + 140;
                var randomHeight = Math.floor(Math.random() * biggestJumpableHeight) + lowest;
                var leftValue = (previousTile.x + previousTile.width);
                var next = new floor(leftValue, randomHeight);
                this.floorTiles.push(next);
            },
            cleanOldTiles: function() {
                for(index in this.floorTiles) {
                    if(this.floorTiles[index].x <= -this.floorTiles[index].width) {
                        this.floorTiles.splice(index, 1);
                        this.tilesPassed++;
                        if(this.tilesPassed % 3 == 0 && this.speed < this.maxSpeed) {
                            this.speed++;
                        }
                    }
                }
            },
            getDistanceToFloor: function(playerX) {
                for(index in this.floorTiles) {
                    var tile = this.floorTiles[index];
                    if(tile.x <= playerX && tile.x + tile.width >= playerX) {
                        return tile.height;
                    }
                }
                return -1;
            },
            tick: function() {
                if(!this.autoScroll) {
                    return;
                }
                this.cleanOldTiles();
                this.addFutureTiles();
                this.moveFloor();
            },
            draw: function() {
                ctx.fillStyle = "black";
                ctx.fillRect (0, 0, this.width, this.height);
                for(index in this.floorTiles) {
                    var tile = this.floorTiles[index];
                    var y = world.height - tile.height;
                    ctx.fillStyle = "blue";
                    ctx.fillRect(tile.x, y, tile.width, tile.height);
                }
                ctx.fillStyle = "white";
                ctx.font = "20px Arial";
                ctx.fillText("Speed: " + this.speed, 10, 40);
                ctx.fillText("Travelled: " + this.distanceTravelled + "m", 10, 75);
                ctx.fillText("Highscore: " + highscore + "m", 10, 110);
            }
        };
        var player = {
            x: 160,
            y: 340,
            height: 20,
            width: 20,
            downwardForce: world.gravity,
            jumpHeight: 0,
            getDistanceFor: function(x) {
                var platformBelow = world.getDistanceToFloor(x);
                return world.height - this.y - platformBelow;
            },
            applyGravity: function() {
                this.currentDistanceAboveGround = this.getDistanceFor(this.x);
                var rightHandSideDistance = this.getDistanceFor(this.x + this.width);
                if(this.currentDistanceAboveGround < 0 || rightHandSideDistance < 0) {
                    world.stop();
                }
            },
            processGravity: function() {
                this.y += this.downwardForce;
                var floorHeight = world.getDistanceToFloor(this.x, this.width);
                var topYofPlatform = world.height - floorHeight;
                if(this.y > topYofPlatform) {
                    this.y = topYofPlatform;
                }
                if(this.downwardForce < 0) {
                    this.jumpHeight += (this.downwardForce * -1);
                    if(this.jumpHeight >= player.height * 6) {
                        this.downwardForce = world.gravity;
                        this.jumpHeight = 0;
                    }
                }
            },
            keyPress: function(keyInfo) {
                var floorHeight = world.getDistanceToFloor(this.x, this.width);
                var onTheFloor = floorHeight == (world.height - this.y);
                if(onTheFloor) {
                    this.downwardForce = -8;
                }
            },
            tick: function() {
                this.processGravity();
                this.applyGravity();
            },
            draw: function() {
                ctx.fillStyle = "green";
                ctx.fillRect(player.x, player.y - player.height, this.height, this.width);
            }
        };
        window.addEventListener("keypress", function(keyInfo) { player.keyPress(keyInfo); }, false);
        window.addEventListener("load", chechtouch(), false);
        function checktouch() {
            if(document.getElementById("canvas").mousedown()) {
                player.keyPress();
            }
            checktouch();
        }
        function tick() {
            player.tick();
            world.tick();
            world.draw();
            player.draw();
            window.setTimeout("tick()", 1000/60);
        }
        function start() {
            new Audio("background.m4a").play();
            document.getElementById("load").innerHTML = "Controls: Tap the screen on the player or press any key.";
            window.setTimeout("start1()", 1500);
        }
        function start1() {
            document.getElementById("load").innerHTML = "Get ready to go!";
            window.setTimeout("start2()", 500);
        }
        function start2() {
            document.getElementById("load").innerHTML = "Rendering game...";
            window.setTimeout("start3()", 500);
        }
        function start3() {
            document.getElementById("load").innerHTML = "Starting...";
            window.setTimeout("start4()", 500);
            var random = Math.floor(Math.random() * 1) + 8;
             if(random == 7) { window.location = "er.html"; }
        }
        function start4() {
            document.getElementById("menu").className = "menu";
            document.getElementById("load").className = "hidden";
            document.getElementById("canvas").className = "showing";

            tick();
        }
        function load() {
             window.setTimeout("start();", 2000);
        }
