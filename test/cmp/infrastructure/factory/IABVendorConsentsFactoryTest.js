import {expect} from 'chai'
import {ConsentString} from 'consent-string'
import IABVendorConsentsFactory from '../../../../src/cmp/infrastructure/factory/IABVendorConsentsFactory'

describe('IAB VendorConsents Factory', () => {
  describe('createVendorConsents method', () => {
    it('Should return a VendorConsents with all vendors and purposes if no ids restriction is set', done => {
      const givenGdprApplies = true
      const givenStoreConsentGlobally = false
      const givenGlobalVendorList = require('./../../resources/globalvendorlist.json')
      const givenPurposesAllowed = [1, 2]
      const givenVendorsAllowed = [1, 6]

      const givenConsent = new ConsentString()
      givenConsent.setPurposesAllowed(givenPurposesAllowed)
      givenConsent.setVendorsAllowed(givenVendorsAllowed)

      const factory = new IABVendorConsentsFactory({
        gdprApplies: givenGdprApplies,
        storeConsentGlobally: givenStoreConsentGlobally
      })

      factory
        .createVendorConsents({
          globalVendorList: givenGlobalVendorList,
          consent: givenConsent
        })
        .then(vendorConsents => {
          expect(
            Object.keys(vendorConsents.vendorConsents).length,
            'the vendor consents should contain an entry for each vendor in the global list'
          ).to.be.equal(givenGlobalVendorList.vendors.length)
          expect(
            Object.keys(vendorConsents.purposeConsents).length,
            'the purpose consents should contain an entry for each vendor in the global list'
          ).to.be.equal(givenGlobalVendorList.purposes.length)
          givenGlobalVendorList.vendors.forEach(v => {
            const condition = givenVendorsAllowed.includes(v.id)
            expect(
              vendorConsents.vendorConsents[v.id],
              `The vendor consent ${
                vendorConsents.vendorConsents[v.id]
              } should be ${condition}`
            ).to.equal(condition)
          })
          givenGlobalVendorList.purposes.forEach(p => {
            const condition = givenPurposesAllowed.includes(p.id)
            expect(
              vendorConsents.purposeConsents[p.id],
              `The purpose consent ${
                vendorConsents.purposeConsents[p.id]
              } should be ${condition}`
            ).to.equal(condition)
          })
        })
        .then(() => done())
        .catch(e => done(e))
    })
    it('Should return a VendorConsents with only the existing vendors included in the given vendorIds', done => {
      const givenGdprApplies = true
      const givenStoreConsentGlobally = false
      const givenGlobalVendorList = require('./../../resources/globalvendorlist.json')
      const givenPurposesAllowed = [1, 2]
      const givenVendorsAllowed = [1, 6]
      const givenAllowedVendorsIds = [1, 5, 6]

      const givenConsent = new ConsentString()
      givenConsent.setPurposesAllowed(givenPurposesAllowed)
      givenConsent.setVendorsAllowed(givenVendorsAllowed)

      const factory = new IABVendorConsentsFactory({
        gdprApplies: givenGdprApplies,
        storeConsentGlobally: givenStoreConsentGlobally
      })

      factory
        .createVendorConsents({
          globalVendorList: givenGlobalVendorList,
          consent: givenConsent,
          allowedVendorIds: givenAllowedVendorsIds
        })
        .then(vendorConsents => {
          expect(
            Object.keys(vendorConsents.vendorConsents).length,
            'the vendor consents should contain 2 elements'
          ).to.be.equal(2)
        })
        .then(() => done())
        .catch(e => done(e))
    })
  })
})
