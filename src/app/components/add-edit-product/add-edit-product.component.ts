import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.sass']
})
export class AddEditProductComponent {
  form: FormGroup;
  loading: boolean = false;
  id: number;
  operacion: string = 'Agregar ';
  
  constructor(private fb: FormBuilder,
    private _productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute
    ){
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, Validators.required],
      stock: [null, Validators.required]
    })
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
    console.log(this.id)
  }

  ngOnInit(): void {
    if(this.id !=0){
      //es editar 
      this.operacion =  'Editar ';
      this.getProduct(this.id);
    }
  }

  getProduct(id: number) {
    this.loading = true;
    this._productService.getProduct(id).subscribe((data: Product) => {
      this.loading = false;
      this.form.setValue({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock
      })
    })
  }

  addProduct(){
   const product: Product = {
      name: this.form.value.name,
      description: this.form.value.description,
      price: this.form.value.price,
      stock: this.form.value.stock
    }
    this.loading = true;

    if(this.id !== 0){
      //es editar
        product.id = this.id;
        this._productService.updateProduct(this.id,product).subscribe(() =>{
          this.toastr.info(`El producto "${product.name}" fue actualizado con exito`, `Producto Actualizado`);
          this.router.navigate(['/']);
          this.loading = false;
        })
    }else{
      //es agregar
      this._productService.saveProduct(product).subscribe(() => {
        this.toastr.success(`El producto "${product.name}" fue registrado con exito`, `Producto Registrado`)
        this.router.navigate(['/']);
        this.loading = false;
      })
    } 
  }
}
