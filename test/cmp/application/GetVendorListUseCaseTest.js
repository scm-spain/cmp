/* eslint-disable prettier/prettier */
import {expect} from 'chai'
import sinon from 'sinon'
import GetVendorListUseCase from "../../../src/cmp/application/GetVendorListUseCase";

describe('Get Vendor List Use Case', () => {
    it('Should return the global vendor list', done => {
        const expectedResult = 'whatever result'
        const vendorRepositoryMock = {
            getGlobalVendorList: () => Promise.resolve(expectedResult)
        }

        const useCase = new GetVendorListUseCase({
            vendorRepository: vendorRepositoryMock
        })

        const getGlobalVendorListSpy = sinon.spy(vendorRepositoryMock, 'getGlobalVendorList')

        useCase.getVendorList()
            .then(result => {
                expect(getGlobalVendorListSpy.calledOnce, 'result should be the vendor list returned by the repository').to.be.true
                expect(result, 'result should be the vendor list returned by the repository').to.deep.equal(expectedResult)
            })
            .then(() => done())
            .catch(e => done(e))
    })
})
