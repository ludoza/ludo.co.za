---
title: Action, history and the chicken and egg problem
---
# Action, history and the chicken and egg problem

The design behind the following database structure is to implement a history of a row in a table and a rigid update procedure.

# Tables

We have the following tables:

Operator, OperatorHistory, Action, ActionTransition. You can find the create SQL script in the Appendix.

Each table at least have the following system meta data columns:

- rowdeleted of type boolean
- rowtimestamp of type timestamp
- rowoperatorid of type character
- rowactionid of type character

The examples in this document will create some confusion because we are using the Operator id as the rowoperatorid. So for the operator table you will have a id and rowoperatorid with a constraint to itself on the id column, hence my chicken and egg problem. But for simplistic sake I just dropped the constraint.

# Triggers



# Appendix

	-- Table: operator

	-- DROP TABLE operator;

	CREATE TABLE operator
	(
	  rowdeleted boolean,
	  rowtimestamp timestamp without time zone,
	  id character varying(255) NOT NULL,
	  fullname character varying(255),
	  password character varying(255),
	  email character varying(255),
	  rowoperatorid character varying(255),
	  rowactionid character varying(255),
	  CONSTRAINT operator_pkey PRIMARY KEY (id),
	  CONSTRAINT fk_operator_rowoperator_id FOREIGN KEY (rowoperatorid)
	      REFERENCES operator (id) MATCH SIMPLE
	      ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE operator
	  OWNER TO postgres;

	-- Trigger: modify_operator on operator

	-- DROP TRIGGER modify_operator ON operator;

	CREATE TRIGGER modify_operator
	  BEFORE INSERT OR UPDATE
	  ON operator
	  FOR EACH ROW
	  EXECUTE PROCEDURE modify_operator();

	-- Table: operatorhistory

	-- DROP TABLE operatorhistory;

	CREATE TABLE operatorhistory
	(
	  rowdeleted boolean,
	  rowtimestamp timestamp without time zone,
	  id serial NOT NULL,
	  fullname character varying(255),
	  password character varying(255),
	  email character varying(255),
	  rowoperatorid character varying(255),
	  rowactionid character varying(255),
	  operatorid character varying(255),
	  revision integer,
	  CONSTRAINT operatorhistory_pkey PRIMARY KEY (id)
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE operatorhistory
	  OWNER TO postgres;

	-- Table: action

	-- DROP TABLE action;

	CREATE TABLE action
	(
	  rowdeleted boolean,
	  rowtimestamp timestamp without time zone,
	  id character varying(255) NOT NULL,
	  name character varying(255),
	  description character varying(255),
	  rowoperatorid character varying(255),
	  rowactionid character varying(255),
	  CONSTRAINT action_pkey PRIMARY KEY (id),
	  CONSTRAINT fk_action_rowoperator_id FOREIGN KEY (rowoperatorid)
	      REFERENCES operator (id) MATCH SIMPLE
	      ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE action
	  OWNER TO postgres;

	-- Table: actiontransition

	-- DROP TABLE actiontransition;

	CREATE TABLE actiontransition
	(
	  id serial NOT NULL,
	  rowdeleted boolean,
	  rowtimestamp timestamp without time zone,
	  entryactionid character varying(255),
	  exitactionid character varying(255),
	  label character varying(255),
	  description character varying(255),
	  rowoperatorid character varying(255),
	  rowactionid character varying(255),
	  CONSTRAINT actiontransition_pkey PRIMARY KEY (id),
	  CONSTRAINT actiontransition_entryactionid_fkey FOREIGN KEY (entryactionid)
	      REFERENCES action (id) MATCH SIMPLE
	      ON UPDATE NO ACTION ON DELETE NO ACTION,
	  CONSTRAINT actiontransition_exitactionid_fkey FOREIGN KEY (exitactionid)
	      REFERENCES action (id) MATCH SIMPLE
	      ON UPDATE NO ACTION ON DELETE NO ACTION,
	  CONSTRAINT actiontransition_rowactionid_fkey FOREIGN KEY (rowactionid)
	      REFERENCES action (id) MATCH SIMPLE
	      ON UPDATE NO ACTION ON DELETE NO ACTION,
	  CONSTRAINT fk_actiontransistion_rowoperato FOREIGN KEY (rowoperatorid)
	      REFERENCES operator (id) MATCH SIMPLE
	      ON UPDATE NO ACTION ON DELETE NO ACTION
	)
	WITH (
	  OIDS=FALSE
	);
	ALTER TABLE actiontransition
	  OWNER TO postgres
  
	-- Function: action_transition_exist()  

	-- DROP FUNCTION action_transition_exist();  

	CREATE OR REPLACE FUNCTION action_transition_exist()  
	  RETURNS trigger AS  
	$BODY$  
	DECLARE  
	result int;  
	BEGIN  
	result = (select count(*) from actiontransition where entryactionid = old.rowactionid and exitactionid = new.rowactionid);  
	if (result = 0) then  
	    RAISE EXCEPTION 'No action transition from "%" to "%"', old.rowactionid, new.rowactionid;  
	    return null;  
	end if;	  
	return new;  
	END;  
	$BODY$  
	  LANGUAGE plpgsql VOLATILE  
	  COST 100;  
  
	ALTER FUNCTION action_transition_exist()  
	  OWNER TO postgres;  

    Function: modify_operator()  

	-- DROP FUNCTION modify_operator();  

	CREATE OR REPLACE FUNCTION modify_operator()  
	  RETURNS trigger AS  
	$BODY$  
	DECLARE  
	row record;  
	count int;  
	BEGIN  
	if (tg_op='INSERT') then  
	    row = new;  
	end if;  
	if (tg_op='UPDATE') then  
	    row = old;  
	end if;  
	count = (SELECT count(*) FROM operatorhistory WHERE operatorid = row.id);  
	INSERT INTO operatorhistory(  
	            rowdeleted, rowtimestamp, fullname, password, email, rowoperatorid,   
	            rowactionid, operatorid, revision)  
	    VALUES (row.rowdeleted, row.rowtimestamp, row.fullname, row.password, row.email, row.rowoperatorid,   
	            row.rowactionid, row.id, count);  
	return row;  
	END;  
	$BODY$  
	  LANGUAGE plpgsql VOLATILE  
	  COST 100;  
	ALTER FUNCTION modify_operator()  
	OWNER TO postgres;
