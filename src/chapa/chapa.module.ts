import { Module } from "@nestjs/common";
import { ChapaService } from "./chapa.service";

@Module({
    providers: [ChapaService],
    exports: [ChapaService],

})
export class ChapaModule {}