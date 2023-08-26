window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const context = canvas.getContext('2d');

    // Setting the width and height of canvas to cover the whole window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Creating a class that has the blueprint for particle
    class Particles {
        constructor(effect, x, y, color) {
            this.effect = effect;
            this.x = Math.random() * this.effect.width;
            this.y = 0;

            // Creating variables that store the "base position" of the particle
            this.originX = Math.floor(x);
            this.originY = Math.floor(y);
            
            this.color = color;
            this.size = this.effect.skip;
            this.velocityX = 0;
            this.velocityY = 0;
            this.ease = 0.01;

            // Creating variables for mouse hover
            this.dx = 0;
            this.dy = 0;
            this.distance = 0;
            this.friction = 0.95;
            this.force = 0;
            this.angle = 0
        }

        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }

        update() {
            // Algorithm for getting mouse hover effect
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = -this.effect.mouse.radius / this.distance;
            if (this.distance < this.effect.mouse.radius) {
                this.angle = Math.atan2(this.dy, this.dx);
                this.velocityX += this.force * Math.cos(this.angle);
                this.velocityY += this.force * Math.sin(this.angle);
            }

            this.x += (this.velocityX *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.velocityY *= this.friction) + (this.originY - this.y) * this.ease;
        }

        warp() {
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.ease = 0.05;
        }
    }

    // Creating a class that will create particles and effects
    class Effects {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.particlesArray = [];
            this.image = document.getElementById('image1');
            // Getting the X and Y positions to calculate the offset for centering
            this.imageXPos = this.width * 0.5;
            this.imageYPos = this.height * 0.5;

            this.imageCenterOffsetX = this.imageXPos - this.image.width * 0.5;
            this.imageCenterOffsetY = this.imageYPos - this.image.height * 0.5;

            this.skip = 3;

            this.mouse = {
                radius: 1000,
                x: 0,
                y: 0
            }
            window.addEventListener('mousemove', event => {
                this.mouse.x = event.x;
                this.mouse.y = event.y;
            })

        }

        init(ctx) {
            ctx.drawImage(this.image, this.imageCenterOffsetX, this.imageCenterOffsetY);
            const imageData = ctx.getImageData(0, 0, this.width, this.height).data;

            for (let y = 0; y < this.height; y += this.skip) {
                for (let x = 0; x < this.width; x += this.skip) {
                    const index = ( y * this.width + x ) * 4;
                    const red = imageData[ index ];
                    const green = imageData[ index + 1];
                    const blue = imageData[ index + 2];
                    const alpha = imageData[ index + 3 ];
                    const color = `rgb(${red}, ${green}, ${blue})`;

                    if (alpha > 0) {
                        this.particlesArray.push(new Particles(this, x, y, color));
                    }
                }
            }
        }

        draw(ctx) {
            this.particlesArray.forEach(particle => particle.draw(ctx));
        }

        update() {
            this.particlesArray.forEach(particle => particle.update());
        }

        warp() {
            this.particlesArray.forEach(particle => particle.warp());
        }
    }

    // Creating a function that will actually animate the stuff that we are trying to make
    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        effects.draw(context);
        effects.update();
        window.requestAnimationFrame(animate);
    }

    const effects = new Effects(canvas.width, canvas.height);
    effects.init(context);

    animate();

    // Warp Functionality
    const warpButton = document.getElementById('warpButton');
    warpButton.addEventListener('click', function() {
        effects.warp();
    })
});