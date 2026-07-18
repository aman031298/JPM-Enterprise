import { Router } from "express";
import { EntityController } from "../controllers/entity-controller.js";
import { requirePermission } from "../middlewares/authenticate.js";
import type { Resource } from "../../../../shared/permissions.js";

export function buildEntityRouter<T extends { id: string }, TCreate extends object, TUpdate extends object>(
  controller: EntityController<T, TCreate, TUpdate>,
  resource: Resource
) {
  const router = Router();
  const canRead = requirePermission(resource, "read");
  const canWrite = requirePermission(resource, "write");

  router.get("/", canRead, controller.list);
  router.get("/:id", canRead, controller.get);
  router.post("/", canWrite, controller.create);
  router.put("/:id", canWrite, controller.update);
  router.delete("/:id", canWrite, controller.remove);

  return router;
}
