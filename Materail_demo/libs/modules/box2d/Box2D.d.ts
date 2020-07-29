declare type uint = number;
declare type int = number;
declare type float = number;

// declare var Box2D: any;

declare namespace Box2D {

    export const ALLOC_STACK: any;

    export function allocate(slab: uint, type: string, allocator: any): uint;
    export function setValue(offset: uint, value: any, type: string): void;
    export function wrapPointer<T>(offset: uint, value: T): InstanceType<T>;
    export function destroy(pointer: any): void;

    export const enum b2BodyType {
        Static = 0,
        Kinematic = 1,
        Dynamic = 2,
    }

    export const enum b2ShapeType {
        Circle = 0,
        Edge = 1,
        Polygon = 2,
        Chain = 3,
        typeCount = 4,
    }

    export const enum b2JointType {
        "e_unknownJoint",
        "e_revoluteJoint",
        "e_prismaticJoint",
        "e_distanceJoint",
        "e_pulleyJoint",
        "e_mouseJoint",
        "e_gearJoint",
        "e_wheelJoint",
        "e_weldJoint",
        "e_frictionJoint",
        "e_ropeJoint",
        "e_motorJoint",
    }

    export const enum b2LimitState {
        "e_inactiveLimit",
        "e_atLowerLimit",
        "e_atUpperLimit",
        "e_equalLimits",
    }

    export const enum b2ContactFeatureType {
        "b2ContactFeature::e_vertex",
        "b2ContactFeature::e_face",
    }

    export const enum b2DrawFlag {
        "b2Draw::e_shapeBit",
        "b2Draw::e_jointBit",
        "b2Draw::e_aabbBit",
        "b2Draw::e_pairBit",
        "b2Draw::e_centerOfMassBit",
    }

    export const enum b2ManifoldType {
        "b2Manifold::e_circles",
        "b2Manifold::e_faceA",
        "b2Manifold::e_faceB",
    }

    // [NoDelete]
    export class b2Contact {
        GetManifold(): b2Manifold;
        GetWorldManifold(manifold: b2WorldManifold): void;
        IsTouching(): boolean;
        SetEnabled(flag: boolean): void;
        IsEnabled(): boolean;
        GetNext(): b2Contact;
        GetFixtureA(): b2Fixture;
        GetChildIndexA(): uint;
        GetFixtureB(): b2Fixture;
        GetChildIndexB(): uint;
        SetFriction(friction: float): void;
        GetFriction(): float;
        ResetFriction(): void;
        SetRestitution(restitution: float): void;
        GetRestitution(): float;
        ResetRestitution(): void;
        SetTangentSpeed(speed: float): void;
        GetTangentSpeed(): float;
    }

    export class b2ContactListener {
    }
    // [JSImplementation = "b2ContactListener"]
    export class JSContactListener {
        new(): this;
        BeginContact(contact: b2Contact): void;
        EndContact(contact: b2Contact): void;
        PreSolve(contact: b2Contact, oldManifold: Readonly<b2Manifold>): void;
        PostSolve(contact: b2Contact, impulse: Readonly<b2ContactImpulse>): void;
    }

    export class b2World {
        new(gravity: b2Vec2): this;
        SetDestructionListener(listener: b2DestructionListener): void;
        SetContactFilter(filter: JSContactFilter): void;
        SetContactListener(listener: JSContactListener): void;
        SetDebugDraw(debugDraw: b2Draw): void;
        CreateBody(def: Readonly<b2BodyDef>): b2Body;
        DestroyBody(body: b2Body): void;
        CreateJoint(def: Readonly<b2JointDef>): b2Joint;
        DestroyJoint(joint: b2Joint): void;
        Step(timeStep: float, velocityIterations: uint, positionIterations: uint): void;
        ClearForces(): void;
        DrawDebugData(): void;
        QueryAABB(callback: b2QueryCallback, aabb: b2AABB): void;
        RayCast(callback: b2RayCastCallback, point1: b2Vec2, point2: b2Vec2): void;
        GetBodyList(): b2Body;
        GetJointList(): b2Joint;
        GetContactList(): b2Contact;
        SetAllowSleeping(flag: boolean): void;
        GetAllowSleeping(): boolean;
        SetWarmStarting(flag: boolean): void;
        GetWarmStarting(): boolean;
        SetContinuousPhysics(flag: boolean): void;
        GetContinuousPhysics(): boolean;
        SetSubStepping(flag: boolean): void;
        GetSubStepping(): boolean;
        GetProxyCount(): uint;
        GetBodyCount(): uint;
        GetJointCount(): uint;
        GetContactCount(): uint;
        GetTreeHeight(): uint;
        GetTreeBalance(): uint;
        GetTreeQuality(): float;
        SetGravity(gravity: b2Vec2): void;
        GetGravity(): b2Vec2;
        IsLocked(): boolean;
        SetAutoClearForces(flag: boolean): void;
        GetAutoClearForces(): boolean;
        GetProfile(): Readonly<b2Profile>;
        Dump(): void;
    }

    export abstract class b2Shape {
        GetType(): b2ShapeType;
        GetChildCount(): uint;
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: b2Transform, childIndex: uint): boolean;
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: uint): void;
        ComputeMass(massD2MassDatbay: float, densiattat): void;

        m_type: b2ShapeType;
        m_radius: float;
    }

    export class b2FixtureDef {
        new(): this;

        shape: Readonly<b2Shape>;
        userData: any;
        friction: float;
        restitution: float;
        density: float;
        isSensor: boolean;
        filter: b2Filter;
    }

    export class b2Fixture {
        GetType(): b2ShapeType;
        GetShape(): b2Shape;
        SetSensor(sensor: boolean): void;
        IsSensor(): boolean;
        SetFilterData(filter: b2Filter): void;
        GetFilterData(): b2Filter;
        Refilter(): void;
        GetBody(): b2Body;
        GetNext(): b2Fixture;
        GetUserData(): any;
        SetUserData(data: any): void;
        TestPoint(p: b2Vec2): boolean;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, childIndex: uint): boolean;
        GetMassData(massData: b2MassData): void;
        SetDensity(density: float): void;
        GetDensity(): float;
        GetFriction(): float;
        SetFriction(friction: float): void;
        GetRestitution(): float;
        SetRestitution(restitution: float): void;
        GetAABB(childIndex: uint): b2AABB;
        Dump(bodyIndex: uint): void;
    }

    export class b2Transform {
        new(): this;
        new(position: b2Vec2, rotation: b2Rot): this;
        SetIdentity(): void;
        Set(position: b2Vec2, angle: float): void;

        p: b2Vec2;
        q: b2Rot;
    }

    export class b2RayCastCallback {
    }
    // [JSImplementation = "b2RayCastCallback"]
    export class JSRayCastCallback {
        new(): this;
        ReportFixture(fixture: b2Fixture, point: b2Vec2, normal: b2Vec2, fraction: float): float;
    }

    export class b2QueryCallback {
    }
    // [JSImplementation = "b2QueryCallback"]
    export class JSQueryCallback {
        new(): this;
        ReportFixture(fixture: b2Fixture): boolean;
    }

    export class b2MassData {
        new(): this;

        mass: float;
        center: b2Vec2;
        I: float;
    }

    export class b2Vec2 {
        new(): this;
        new(x: float, y: float): this;
        SetZero(): void;
        Set(x: float, y: float): void;
        op_add(v: b2Vec2): void;
        op_sub(v: b2Vec2): void;
        op_mul(s: float): void;
        Length(): float;
        LengthSquared(): float;
        Normalize(): float;
        IsValid(): boolean;
        Skew(): b2Vec2;

        x: float;
        y: float;
    }

    export class b2Vec3 {
        new(): this;
        new(x: float, y: float, z: float): this;
        SetZero(): void;
        Set(x: float, y: float, z: float): void;
        op_add(v: b2Vec3): void;
        op_sub(v: b2Vec3): void;
        op_mul(s: float): void;

        x: float;
        y: float;
        z: float;
    }

    // [NoDelete]
    export class b2Body {
        CreateFixture(def: b2FixtureDef): b2Fixture;
        CreateFixture(shape: b2Shape, density: float): b2Fixture;
        DestroyFixture(fixture: b2Fixture): void;
        SetTransform(position: b2Vec2, angle: float): void;
        GetTransform(): b2Transform;
        GetPosition(): b2Vec2;
        GetAngle(): float;
        GetWorldCenter(): b2Vec2;
        GetLocalCenter(): b2Vec2;
        SetLinearVelocity(v: b2Vec2): void;
        GetLinearVelocity(): b2Vec2;
        SetAngularVelocity(omega: float): void;
        GetAngularVelocity(): float;
        ApplyForce(force: Readonly<b2Vec2>, point: Readonly<b2Vec2>, awake: boolean): void;
        ApplyForceToCenter(force: Readonly<b2Vec2>, awake: boolean): void;
        ApplyTorque(torque: float, awake: boolean): void;
        ApplyLinearImpulse(impulse: Readonly<b2Vec2>, point: Readonly<b2Vec2>, awake: boolean): void;
        ApplyAngularImpulse(impulse: float, awake: boolean): void;
        GetMass(): float;
        GetInertia(): float;
        GetMassData(data: b2MassData): void;
        SetMassData(data: b2MassData): void;
        ResetMassData(): void;
        GetWorldPoint(localPoint: b2Vec2): b2Vec2;
        GetWorldVector(localVector: b2Vec2): b2Vec2;
        GetLocalPoint(worldPoint: b2Vec2): b2Vec2;
        GetLocalVector(worldVector: b2Vec2): b2Vec2;
        GetLinearVelocityFromWorldPoint(worldPoint: b2Vec2): b2Vec2;
        GetLinearVelocityFromLocalPoint(localPoint: b2Vec2): b2Vec2;
        GetLinearDamping(): float;
        SetLinearDamping(linearDamping: float): void;
        GetAngularDamping(): float;
        SetAngularDamping(angularDamping: float): void;
        GetGravityScale(): float;
        SetGravityScale(scale: float): void;
        SetType(type: b2BodyType): void;
        GetType(): b2BodyType;
        SetBullet(flag: boolean): void;
        IsBullet(): boolean;
        SetSleepingAllowed(flag: boolean): void;
        IsSleepingAllowed(): boolean;
        SetAwake(flag: boolean): void;
        IsAwake(): boolean;
        SetActive(flag: boolean): void;
        IsActive(): boolean;
        SetFixedRotation(flag: boolean): void;
        IsFixedRotation(): boolean;
        GetFixtureList(): b2Fixture;
        GetJointList(): b2JointEdge;
        GetContactList(): b2ContactEdge;
        GetNext(): b2Body;
        GetUserData(): any;
        SetUserData(data: any): void;
        GetWorld(): b2World;
        Dump(): void;
    }

    export class b2BodyDef {
        new(): this;

        type: b2BodyType;
        position: b2Vec2;
        angle: float;
        linearVelocity: b2Vec2;
        angularVelocity: float;
        linearDamping: float;
        angularDamping: float;
        allowSleep: boolean;
        awake: boolean;
        fixedRotation: boolean;
        bullet: boolean;
        active: boolean;
        userData: any;
        gravityScale: float;
    }

    export class b2Filter {
        new(): this;

        categoryBits: uint;
        maskBits: uint;
        groupIndex: uint;
    }

    export class b2AABB {
        new(): this;
        IsValid(): boolean;
        GetCenter(): b2Vec2;
        GetExtents(): b2Vec2;
        GetPerimeter(): float;
        Combine(aabb: b2AABB): void;
        Combine(aabb1: b2AABB, aabb2: b2AABB): void;
        Contains(aabb: b2AABB): boolean;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput): boolean;

        lowerBound: b2Vec2;
        upperBound: b2Vec2;
    }

    export class b2CircleShape extends b2Shape {
        new(): this;

        m_p: b2Vec2;
    }

    export class b2EdgeShape extends b2Shape {
        new(): this;
        Set(v1: b2Vec2, v2: b2Vec2): void;

        m_vertex1: b2Vec2;
        m_vertex2: b2Vec2;
        m_vertex0: b2Vec2;
        m_vertex3: b2Vec2;
        m_hasVertex0: boolean;
        m_hasVertex3: boolean;
    }

    export class b2JointDef {
        new(): this;

        type: b2JointType;
        userData: any;
        bodyA: b2Body;
        bodyB: b2Body;
        collideConnected: boolean;
    }

    // [NoDelete]
    export class b2Joint {
        GetType(): b2JointType;
        GetBodyA(): b2Body;
        GetBodyB(): b2Body;
        GetAnchorA(): b2Vec2;
        GetAnchorB(): b2Vec2;
        GetReactionForce(inv_dt: float): b2Vec2;
        GetReactionTorque(inv_dt: float): float;
        GetNext(): b2Joint;
        GetUserData(): any;
        SetUserData(data: any): void;
        IsActive(): boolean;
        GetCollideConnected(): boolean;
        Dump(): void;
    }

    export class b2WeldJoint extends b2Joint {
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        SetFrequency(hz: float): void;
        GetFrequency(): float;
        SetDampingRatio(ratio: float): void;
        GetDampingRatio(): float;
        Dump(): void;
    }

    export class b2WeldJointDef extends b2JointDef {
        new(): this;
        Initialize(bodyA: b2Body, bodyB: b2Body, anchor: b2Vec2): void;

        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        referenceAngle: float;
        frequencyHz: float;
        dampingRatio: float;
    }

    export class b2ChainShape extends b2Shape {
        new(): this;
        Clear(): void;
        CreateLoop(vertices: b2Vec2, count: uint): void;
        CreateChain(vertices: b2Vec2, count: uint): void;
        SetPrevVertex(prevVertex: b2Vec2): void;
        SetNextVertex(nextVertex: b2Vec2): void;
        GetChildEdge(edge: b2EdgeShape, index: uint): void;

        m_vertices: b2Vec2;
        m_count: uint;
        m_prevVertex: b2Vec2;
        m_nextVertex: b2Vec2;
        m_hasPrevVertex: boolean;
        m_hasNextVertex: boolean;
    }

    export class b2Color {
        new(): this;
        new(r: float, g: float, b: float): this;
        Set(ri: float, gi: float, bi: float): void;

        r: float;
        g: float;
        b: float;
    }

    export class b2ContactEdge {
        new(): this;

        other: b2Body;
        contact: b2Contact;
        prev: b2ContactEdge;
        next: b2ContactEdge;
    }

    export class b2ContactFeature {
        indexA: uint;
        indexB: uint;
        typeA: uint;
        typeB: uint;
    }

    export class b2ContactFilter {
    }
    // [JSImplementation = "b2ContactFilter"]
    export class JSContactFilter {
        new(): this;
        ShouldCollide(fixtureA: b2Fixture, fixtureB: b2Fixture): boolean;
    }

    export class b2ContactID {
        cf: b2ContactFeature;
        key: uint;
    }

    export class b2ContactImpulse {
        // TODO: webidl_binder support for array types.
        // normalImpulses: float[];
        // tangentImpulses: float[];
        count: uint;
    }

    export class b2DestructionListener {
    }

    export class b2DestructionListenerWrapper {
    }
    // [JSImplementation = "b2DestructionListenerWrapper"]
    export class JSDestructionListener {
        new(): this;
        // These methods map the overloaded methods from b2DestructionListener onto differently-named
        // methods, so that it is possible to implement both of them in JS.
        SayGoodbyeJoint(joint: b2Joint): void;
        SayGoodbyeFixture(joint: b2Fixture): void;
    }

    export class b2DistanceJoint extends b2Joint {
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        SetLength(length: float): void;
        GetLength(): float;
        SetFrequency(hz: float): void;
        GetFrequency(): float;
        SetDampingRatio(ratio: float): void;
        GetDampingRatio(): float;
    }

    export class b2DistanceJointDef extends b2JointDef {
        new(): this;
        Initialize(bodyA: b2Body, bodyB: b2Body, anchor: b2Vec2, anchorB: b2Vec2): void;

        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        length: float;
        frequencyHz: float;
        dampingRatio: float;
    }

    export class b2Draw {
        SetFlags(flags: uint): void;
        GetFlags(): uint;
        AppendFlags(flags: uint): void;
        ClearFlags(flags: uint): void;
    }

    // [JSImplementation = "b2Draw"]
    export class JSDraw {
        new(): this;
        DrawPolygon(vertices: Readonly<b2Vec2>, vertexCount: uint, color: b2Color): void;
        DrawSolidPolygon(vertices: Readonly<b2Vec2>, vertexCount: uint, color: b2Color): void;
        DrawCircle(center: b2Vec2, radius: float, color: b2Color): void;
        DrawSolidCircle(center: b2Vec2, radius: float, axis: b2Vec2, color: b2Color): void;
        DrawSegment(p1: b2Vec2, p2: b2Vec2, color: b2Color): void;
        DrawTransform(xf: b2Transform): void;
    }

    export class b2FrictionJoint extends b2Joint {
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        SetMaxForce(force: float): void;
        GetMaxForce(): float;
        SetMaxTorque(torque: float): void;
        GetMaxTorque(): float;
    }

    export class b2FrictionJointDef extends b2JointDef {
        new(): this;
        Initialize(bodyA: b2Body, bodyB: b2Body, anchor: b2Vec2): void;

        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        maxForce: float;
        maxTorque: float;
    }

    export class b2GearJoint extends b2Joint {
        GetJoint1(): b2Joint;
        GetJoint2(): b2Joint;
        SetRatio(ratio: float): void;
        GetRatio(): float;
    }

    export class b2GearJointDef extends b2JointDef {
        new(): this;

        joint1: b2Joint;
        joint2: b2Joint;
        ratio: float;
    }

    export class b2JointEdge {
        new(): this;

        other: b2Body;
        joint: b2Joint;
        prev: b2JointEdge;
        next: b2JointEdge;
    }

    export class b2Manifold {
        new(): this;

        // TODO: webidl_binder support for array types.
        // b2ManifoldPoint[] points:;
        localNormal: b2Vec2;
        localPoint: b2Vec2;
        type: b2ManifoldType;
        pointCount: uint;
    }

    export class b2WorldManifold {
        new(): this;
        Initialize(manifold: b2Manifold, xfA: b2Transform, radiusA: float, xfB: b2Transform, radiusB: float): void;

        normal: b2Vec2;
        points: b2Vec2[];
        separations: float[];
    }

    export class b2ManifoldPoint {
        new(): this;

        localPoint: b2Vec2;
        normalImpulse: float;
        tangentImpulse: float;
        id: b2ContactID;
    }

    export class b2Mat22 {
        new(): this;
        new(c1: b2Vec2, c2: b2Vec2): this;
        new(a11: float, a12: float, a21: float, a22: float): this;
        Set(c1: b2Vec2, c2: b2Vec2): void;
        SetIdentity(): void;
        SetZero(): void;
        GetInverse(): b2Mat22;
        Solve(b: b2Vec2): b2Vec2;

        ex: b2Vec2;
        ey: b2Vec2;
    }

    export class b2Mat33 {
        new(): this;
        new(c1: b2Vec3, c2: b2Vec3, c3: b2Vec3): this;
        SetZero(): void;
        Solve33(b: b2Vec3): b2Vec3;
        Solve22(b: b2Vec2): b2Vec2;
        GetInverse22(M: b2Mat33): void;
        GetSymInverse33(M: b2Mat33): void;

        ex: b2Vec3;
        ey: b2Vec3;
        ez: b2Vec3;
    }

    export class b2MouseJoint extends b2Joint {
        SetTarget(target: b2Vec2): void;
        GetTarget(): b2Vec2;
        SetMaxForce(force: float): void;
        GetMaxForce(): float;
        SetFrequency(hz: float): void;
        GetFrequency(): float;
        SetDampingRatio(ratio: float): void;
        GetDampingRatio(): float;
    }

    export class b2MouseJointDef extends b2JointDef {
        new(): this;

        target: b2Vec2;
        maxForce: float;
        frequencyHz: float;
        dampingRatio: float;
    }

    export class b2PolygonShape extends b2Shape {
        new(): this;
        Set(vertices: b2Vec2, vertexCount: uint): void;
        SetAsBox(hx: float, hy: float): void;
        SetAsBox(hx: float, hy: float, center: b2Vec2, angle: float): void;
        GetVertexCount(): uint;
        GetVertex(index: uint): b2Vec2;

        m_centroid: b2Vec2;
        // TODO: webidl_binder support for array types.
        // b2Vec2[] m_vertices:;
        // b2Vec2[] m_normals:;
        m_count: uint;
    }

    export class b2PrismaticJoint extends b2Joint {
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetLocalAxisA(): b2Vec2;
        GetReferenceAngle(): float;
        GetJointTranslation(): float;
        GetJointSpeed(): float;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: boolean): void;
        GetLowerLimit(): float;
        GetUpperLimit(): float;
        SetLimits(lower: float, upper: float): void;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: float): void;
        GetMotorSpeed(): float;
        SetMaxMotorForce(force: float): void;
        GetMaxMotorForce(): float;
        GetMotorForce(inv_dt: float): float;
    }

    export class b2PrismaticJointDef extends b2JointDef {
        new(): this;
        Initialize(bodyA: b2Body, bodyB: b2Body, anchor: b2Vec2, axis: b2Vec2): void;

        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        localAxisA: b2Vec2;
        referenceAngle: float;
        enableLimit: boolean;
        lowerTranslation: float;
        upperTranslation: float;
        enableMotor: boolean;
        maxMotorForce: float;
        motorSpeed: float;
    }

    export class b2Profile {
        step: float;
        collide: float;
        solve: float;
        solveInit: float;
        solveVelocity: float;
        solvePosition: float;
        broadphase: float;
        solveTOI: float;
    }

    export class b2PulleyJoint extends b2Joint {
        GetGroundAnchorA(): b2Vec2;
        GetGroundAnchorB(): b2Vec2;
        GetLengthA(): float;
        GetLengthB(): float;
        GetRatio(): float;
        GetCurrentLengthA(): float;
        GetCurrentLengthB(): float;
    }

    export class b2PulleyJointDef extends b2JointDef {
        new(): this;
        Initialize(bodyA: b2Body, bodyB: b2Body, groundAnchorA: b2Vec2, groundAnchorB: b2Vec2, anchorA: b2Vec2, anchorB: b2Vec2, ratio: float): void;

        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        lengthA: float;
        lengthB: float;
        ratio: float;
    }

    export class b2RayCastInput {
        p1: b2Vec2;
        p2: b2Vec2;
        maxFraction: float;
    }

    export class b2RayCastOutput {
        normal: b2Vec2;
        fraction: float;
    }

    export class b2RevoluteJoint extends b2Joint {
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetReferenceAngle(): float;
        GetJointAngle(): float;
        GetJointSpeed(): float;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: boolean): void;
        GetLowerLimit(): float;
        GetUpperLimit(): float;
        SetLimits(lower: float, upper: float): void;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: float): void;
        GetMotorSpeed(): float;
        SetMaxMotorTorque(torque: float): void;
        GetMaxMotorTorque(): float;
        GetMotorTorque(inv_dt: float): float;
    }

    export class b2RevoluteJointDef extends b2JointDef {
        new(): this;
        Initialize(bodyA: b2Body, bodyB: b2Body, anchor: b2Vec2): void;

        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        referenceAngle: float;
        enableLimit: boolean;
        lowerAngle: float;
        upperAngle: float;
        enableMotor: boolean;
        motorSpeed: float;
        maxMotorTorque: float;
    }

    export class b2RopeJoint extends b2Joint {
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        SetMaxLength(length: float): void;
        GetMaxLength(): float;
        GetLimitState(): b2LimitState;
    }

    export class b2RopeJointDef extends b2JointDef {
        new(): this;

        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        maxLength: float;
    }

    export class b2Rot {
        new(): this;
        new(angle: float): this;
        Set(angle: float): void;
        SetIdentity(): void;
        GetAngle(): float;
        GetXAxis(): b2Vec2;
        GetYAxis(): b2Vec2;

        s: float;
        c: float;
    }

    export class b2WheelJoint extends b2Joint {
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetLocalAxisA(): b2Vec2;
        GetJointTranslation(): float;
        GetJointSpeed(): float;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: float): void;
        GetMotorSpeed(): float;
        SetMaxMotorTorque(torque: float): void;
        GetMaxMotorTorque(): float;
        GetMotorTorque(inv_dt: float): float;
        SetSpringFrequencyHz(hz: float): void;
        GetSpringFrequencyHz(): float;
        SetSpringDampingRatio(ratio: float): void;
        GetSpringDampingRatio(): float;
    }

    export class b2WheelJointDef extends b2JointDef {
        new(): this;
        Initialize(bodyA: b2Body, bodyB: b2Body, anchor: b2Vec2, axis: b2Vec2): void;

        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        localAxisA: b2Vec2;
        enableMotor: boolean;
        maxMotorTorque: float;
        motorSpeed: float;
        frequencyHz: float;
        dampingRatio: float;
    }

    export class b2MotorJoint extends b2Joint {
        SetLinearOffset(linearOffset: b2Vec2): void;
        GetLinearOffset(): b2Vec2;
        SetAngularOffset(angularOffset: float): void;
        GetAngularOffset(): float;
        SetMaxForce(force: float): void;
        GetMaxForce(): float;
        SetMaxTorque(torque: float): void;
        GetMaxTorque(): float;
        SetCorrectionFactor(factor: float): void;
        GetCorrectionFactor(): float;
    }

    export class b2MotorJointDef extends b2JointDef {
        new(): this;
        Initialize(bodyA: b2Body, bodyB: b2Body): void;

        linearOffset: b2Vec2;
        angularOffset: float;
        maxForce: float;
        maxTorque: float;
        correctionFactor: float;
    }
} 
