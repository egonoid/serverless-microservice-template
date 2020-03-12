export abstract class BaseMapper<TENTITY, TMODEL, TENTITYDATA, TMODELDATA> {
  abstract mapToEntity(model: TMODEL, data?: TMODELDATA): TENTITY;
  abstract mapToModel(entity: TENTITY, data?: TENTITYDATA): TMODEL;
}
