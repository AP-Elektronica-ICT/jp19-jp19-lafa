-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS nodes_id_seq;

-- Table Definition
CREATE TABLE IF NOT EXISTS "public"."nodes" (
    "id" int4 NOT NULL DEFAULT nextval('nodes_id_seq'::regclass),
    "label" varchar(64),
    "creation" timestamp NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS sensors_id_seq;

-- Table Definition
CREATE TABLE IF NOT EXISTS "public"."sensors" (
    "id" int4 NOT NULL DEFAULT nextval('sensors_id_seq'::regclass),
    "parent" int4 NOT NULL,
    "label" varchar(64),
    "type" varchar(16) NOT NULL,
    "min" float4 DEFAULT '0'::real,
    "max" float4 DEFAULT '100'::real,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS sensor_data_id_seq;

-- Table Definition
CREATE TABLE "public"."sensor_data" (
    "id" int4 NOT NULL DEFAULT nextval('sensor_data_id_seq'::regclass),
    "parent" int4 NOT NULL,
    "value" float4 NOT NULL,
    "time" timestamp NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);