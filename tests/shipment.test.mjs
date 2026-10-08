import test from 'node:test'; import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; import {analyzeShipment} from '../packages/shipment-trace/engine.mjs';
const fixture=JSON.parse(readFileSync(new URL('../research/transactions/DEMO-CN001-0001.json',import.meta.url)));
test('flags unknown importer rather than inferring from buyer',()=>assert.ok(analyzeShipment(fixture).flags.some(f=>f.code==='IOR_UNVERIFIED')));
test('reports missing entry summary and origin evidence',()=>{let r=analyzeShipment(fixture);assert.ok(r.missing.some(x=>x.key==='entry_summary'));assert.ok(r.missing.some(x=>x.key==='origin_support'))});
test('does not conclude legal liability or recovery',()=>{let r=analyzeShipment(fixture);assert.equal(r.conclusion.importer_liability,'not_determined');assert.equal(r.conclusion.supplier_recovery,'not_determined')});
test('does not require a CBP notice when no notice asserted',()=>{let t=structuredClone(fixture); t.cbp.action='none';assert.equal(analyzeShipment(t).checks.find(x=>x.key==='cbp_notice').status,'not_applicable')});
test('flags missing documentary proof of alleged CBP notice',()=>assert.ok(analyzeShipment(fixture).flags.some(x=>x.code==='CBP_NOTICE_MISSING')));
test('verified entry fields remove ONLY their matching flags',()=>{let t=structuredClone(fixture);t.entry.importer_of_record.status='verified';let r=analyzeShipment(t);assert.ok(!r.flags.some(f=>f.code==='IOR_UNVERIFIED'));assert.ok(r.flags.some(f=>f.code==='ORIGIN_UNVERIFIED'))});
test('requires transaction ID',()=>assert.throws(()=>analyzeShipment({}),/id/));
