class Flame extends Particle {
	centerColor = 0xffe0e9;
	farColor = 0xff7aa2;
	fadeColor = 0xe01e37;
	spawnCount = 100;
	circleLifeCycle = 60;

	fadingCircleTextures = {};
	isActivated = true;

	/* position : Victor
	 * angle : int // uses degrees
	 * flameProps = {
	 *     maxSpeed : int,
	 *     degRange : int
	 * } */
	constructor(core, position, angle, flameProps) {
		super(core);
		this.position = position;
		this.angle = new Victor(1,0).rotateDeg(angle);
		this.maxSpeed = flameProps.maxSpeed ? flameProps.maxSpeed : 1;
		this.degRange = flameProps.degRange ? flameProps.degRange : 90;
	}

	setup() {
		super.setup();
		this.container = new PIXI.ParticleContainer(this.spawnCount * (this.circleLifecycle + 2));
		this.core.app.stage.addChild(this.container);
	}

	update() {
		if (this.isActivated) {
			super.update();
			for (let i = 0; i < this.spawnCount; i++) {
				this.spawnSpark();
			}
		}
	}

	turnOn() {
		this.isActivated = true;
	}

	turnOff() {
		this.isActivated = false;
	}

	randOffset() {
		return (Utils.gaussianRand() - 0.5) * this.degRange;
	}

	spawnSpark() {
		let deg = this.angle.angleDeg();
		let randDegOffset = this.randOffset();
		let randDeg = deg + randDegOffset;
		let velocity = new Victor(this.maxSpeed * Utils.gaussianRand(), 0);
		velocity.rotateDeg(randDeg);

		let fromCenter = Math.abs(randDegOffset) / (this.degRange / 2);
		let fromCenterColor = Utils.lerp(this.centerColor, this.farColor, fromCenter);

		let circle = new FadingCircleP(this.core,
			this.position.clone(),
			velocity,
			this.fadingCircleTextures,
			{
				color: fromCenterColor,
				container: this.container,
				alpha: 1,
				lifecycle: this.circleLifeCycle,
				radius: 4,
				targetAlpha: 0,
				targetColor: this.fadeColor,
			},
		);
		this.addParticle(circle);
	}

	cleanup() {
		super.cleanup();
		this.core.app.stage.removeChild(this.container);
	}
}

class CircleFlame extends Flame {
	constructor(core, position, angle, flameProps) {
		super(core, position, angle, flameProps);
		this.degRange = 360;
	}

	randOffset() {
		return (Math.random() - 0.5) * this.degRange;
	}
}
