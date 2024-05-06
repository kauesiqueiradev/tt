import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Card } from 'src/app/interface/card';
import { DataService, FileData } from 'src/app/data/data.service';
import { FileCacheService } from 'src/app/services/file-cache/file-cache.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent implements OnInit{
  itensPorPagina = 8;
  paginaAtual = 1;

  pdfUrl: any

  type: string = '';
  cards: Card[] = [] ;
  folderName: string = '';
  files: FileData[] = [];
  errorMessage: string = '';
  selectedFileName: string = '';


  @ViewChild('content') popupview !: ElementRef;

  constructor(
    private route: ActivatedRoute, 
    private folderService: DataService, 
    private router: Router, 
    private fileCacheService: FileCacheService,
    private modalservice: NgbModal,
  ) { }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.folderName = params['folderName'];
      this.getFiles(this.folderName);
    })
  }

  getFiles(folder: string): void {
    this.folderService.getFiles(folder).subscribe(
      (data: any) => {
        // console.log("data:", data);
        if (data && data.files && Array.isArray(data.files) && data.files.length > 0) {
          // Verificar se há arquivos PDF na pasta
          const pdfFiles = data.files.filter((fileData: { fileName: string; }) => {
            return fileData.fileName.toLowerCase().endsWith('.pdf');
          });
  
          if (pdfFiles.length > 0) {
            this.files = pdfFiles;
          } else {
            this.files = [];
            this.errorMessage = "Não há arquivos PDF nesta pasta.";
          }
        } else {
          this.files = [];
          if (data && data.error === 'Erro ao ler a pasta') {
            this.errorMessage = "A pasta não existe.";
          } else {
            this.errorMessage = "Essa pasta não contém a pasta: 1. Ativos";
          }
        }
      },
      error => {
        console.error('Erro ao buscar arquivos:', error);
        this.files = [];
        this.errorMessage = "Essa pasta não contém a pasta: 1. Ativos";
      }
    );
  }
 
  // openPdfFile(fileUrl: string): void {
  //    // Verifica se o arquivo é um PDF
  //    if (!fileUrl.toLowerCase().endsWith('.pdf')) {
  //     console.error('O arquivo não é um PDF:', fileUrl);
  //     return;
  //   }
  //   console.log("sera que aqui chega?");

  //     // Verifica se o arquivo já está em cache
  //   if (this.fileCacheService.isFileCached(fileUrl)) {
  //     console.log("abriu aqui");
  //     // Se estiver em cache, abre o arquivo a partir do cache
  //     const cachedFile = this.fileCacheService.getCachedFile(fileUrl);
  //     console.log("abriu aqui 2:", cachedFile);
  //     if (cachedFile) {
  //       const pdfUrl = `localhost:4200${fileUrl}`;
  //       window.open(pdfUrl, '_blank');
  //       // this.openPdfModal(pdfUrl);
  //       console.log("final para executar:", pdfUrl);
  //       // const pdfUrl = URL.createObjectURL(cachedFile);
  //       // this.openPdfModal(pdfUrl);
  //       // window.open(pdfUrl, '_blank');
  //     } else {
  //       console.error('O arquivo não está em cache:', fileUrl);
  //       console.log("ihh rapaz, deu erro para o ELSE em");
  //     }
  //   } else {
  //     // Se não estiver em cache, baixa o arquivo e o armazena em cache antes de abrir
  //     console.log("aqui se n estive em cache");
  //     this.fileCacheService.cacheFile(fileUrl).subscribe(
  //       (file: Blob) => {
  //         const pdfUrl = `localhost:4200${fileUrl}`;
  //         console.log("mas ai tem que baixar ele aqui", pdfUrl);
  //         // this.openPdfModal(pdfUrl);
  //       },
  //       (error: any) => {
  //         console.error('Erro ao abrir o arquivo:', error);
  //         console.log("ihh tbm não baixou :/");
  //       }
  //     );
  //   }
  // }

  PreviewInvoice(folderName: string, fileName: string) {
    this.folderService.GenerateInvoicePDF(folderName, fileName).subscribe({
      next: (res: any) => {
        let blob: Blob = res.body as Blob;
        let url = window.URL.createObjectURL(blob);
        this.pdfUrl = url;
        this.selectedFileName = fileName;

        this.modalservice.open(this.popupview, { fullscreen: true });
      }, error: (error: any) => {
        console.error('Erro ao gerar o PDF do fatura:', error);
      }
    })
  }

  // openPdfModal(pdfUrl: string): void {
    
  //   // const initialState : PdfModalData = {
  //     //   pdfUrl: pdfUrl
  //     // }
  //     // console.log('openPDF estado do initialState:', initialState);
  //     this.bsModalRef = this.modalService.show(PdfModalComponent);
  //     this.bsModalRef.content.pdfUrl = pdfUrl;
  //     console.log("modal service:",this.bsModalRef);
  //     console.log("PDF no card:", this.bsModalRef.content.pdfUrl);
  // }

  // openFile(folder: string, file: string) {
  //   const fileUrl = this.folderService.getOpenFileUrl(folder, file);
  // }

  getPaginaArquivos(): any[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.cards.slice(inicio, fim);
  }

  getTotalPaginas(): number {
    return Math.ceil(this.cards.length / this.itensPorPagina);
  }

  goBackToProcedures() {
    this.router.navigate(['/home/procedures']);
  }
}